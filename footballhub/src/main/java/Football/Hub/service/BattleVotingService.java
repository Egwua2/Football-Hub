package Football.Hub.service;

import Football.Hub.model.BattleParticipant;
import Football.Hub.model.BattleParticipantStatus;
import Football.Hub.model.BattlePositionVote;
import Football.Hub.model.BattleRankingResult;
import Football.Hub.model.BattleResultsResponse;
import Football.Hub.model.BattleRoom;
import Football.Hub.model.BattleRoomStatus;
import Football.Hub.model.BattleVotingOption;
import Football.Hub.model.Player;
import Football.Hub.model.Squad;
import Football.Hub.model.SquadPlayer;
import Football.Hub.repository.BattleParticipantRepository;
import Football.Hub.repository.BattlePositionVoteRepository;
import Football.Hub.repository.BattleRoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class BattleVotingService {

    private static final List<String> POSITION_SLOT_ORDER = List.of(
            "GK",
            "LB", "LWB",
            "CB_A", "CB_B", "CB_C",
            "RB", "RWB",
            "DM", "DM_A", "DM_B", "DM_C",
            "CM_A", "CM_B", "CM_C",
            "LM", "RM",
            "CAM", "CAM_A", "CAM_B", "CAM_C",
            "LW", "RW",
            "ST", "ST_A", "ST_B"
    );

    private final BattleRoomRepository battleRoomRepository;
    private final BattleParticipantRepository battleParticipantRepository;
    private final BattlePositionVoteRepository battlePositionVoteRepository;

    public BattleVotingService(
            BattleRoomRepository battleRoomRepository,
            BattleParticipantRepository battleParticipantRepository,
            BattlePositionVoteRepository battlePositionVoteRepository) {

        this.battleRoomRepository = battleRoomRepository;
        this.battleParticipantRepository = battleParticipantRepository;
        this.battlePositionVoteRepository = battlePositionVoteRepository;
    }

    @Transactional
    public List<BattleVotingOption> getVotingOptions(
            String roomCode,
            String voterName) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.VOTING) {
            throw new IllegalStateException(
                    "Voting is not currently active."
            );
        }

        List<BattleParticipant> participants =
                battleParticipantRepository.findByRoomId(room.getId());

        BattleParticipant voter = participants.stream()
                .filter(item ->
                        item.getPlayerName().equalsIgnoreCase(voterName.trim()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Player is not in this room."
                        ));

        List<String> positionSlots = getPositionSlots(participants);
        List<BattlePositionVote> previousVotes =
                battlePositionVoteRepository.findByRoomIdAndVoterId(
                        room.getId(),
                        voter.getId()
                );

        Map<String, BattlePositionVote> votesBySlot = new HashMap<>();
        for (BattlePositionVote vote : previousVotes) {
            votesBySlot.put(vote.getPositionSlot(), vote);
        }

        List<BattleVotingOption> groups = new ArrayList<>();

        for (String slot : positionSlots) {
            Map<Long, Player> distinctPlayers =
                    getDistinctPlayers(participants, slot);

            boolean automatic = distinctPlayers.size() == 1;
            BattlePositionVote previousVote = votesBySlot.get(slot);
            Player automaticPlayer = automatic
                    ? distinctPlayers.values().iterator().next()
                    : null;

            List<BattleVotingOption.Candidate> options =
                    new ArrayList<>();

            if (!automatic && previousVote == null) {
                Player ownPlayer = getPlayerAtSlot(voter.getSquad(), slot);

                Map<Long, Player> opponents = new LinkedHashMap<>();

                for (BattleParticipant participant : participants) {
                    if (participant.getId().equals(voter.getId())) {
                        continue;
                    }

                    Player player = getPlayerAtSlot(participant.getSquad(), slot);

                    if (player != null &&
                            (ownPlayer == null ||
                                    !player.getId().equals(ownPlayer.getId()))) {
                        opponents.putIfAbsent(player.getId(), player);
                    }
                }

                for (Player player : opponents.values()) {
                    options.add(new BattleVotingOption.Candidate(player));
                }

                Collections.shuffle(options);
            }

            groups.add(
                    new BattleVotingOption(
                            slot,
                            positionLabel(slot),
                            automatic || previousVote != null,
                            automatic,
                            automaticPlayer == null ? null : automaticPlayer.getName(),
                            previousVote != null
                                    ? previousVote.getPlayer().getId()
                                    : automaticPlayer == null
                                            ? null
                                            : automaticPlayer.getId(),
                            options
                    )
            );
        }

        finishVotingIfComplete(room, participants, positionSlots);
        return groups;
    }

    @Transactional
    public BattlePositionVote castVote(
            String roomCode,
            String voterName,
            String positionSlot,
            Long playerId) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.VOTING) {
            throw new IllegalStateException(
                    "Voting is not currently active."
            );
        }

        if (playerId == null || positionSlot == null ||
                positionSlot.isBlank()) {
            throw new IllegalArgumentException(
                    "Choose a player for this position."
            );
        }

        List<BattleParticipant> participants =
                battleParticipantRepository.findByRoomId(room.getId());

        BattleParticipant voter = participants.stream()
                .filter(item ->
                        item.getPlayerName().equalsIgnoreCase(voterName.trim()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Voter is not in this room."
                        ));

        List<String> positionSlots = getPositionSlots(participants);

        if (!positionSlots.contains(positionSlot)) {
            throw new IllegalArgumentException(
                    "That position is not part of this formation."
            );
        }

        Map<Long, Player> distinctPlayers =
                getDistinctPlayers(participants, positionSlot);

        if (distinctPlayers.size() == 1) {
            throw new IllegalStateException(
                    "Everyone selected the same player for this position. The point is awarded automatically."
            );
        }

        if (battlePositionVoteRepository
                .findByRoomIdAndVoterIdAndPositionSlot(
                        room.getId(),
                        voter.getId(),
                        positionSlot
                )
                .isPresent()) {
            throw new IllegalStateException(
                    "You have already voted for this position."
            );
        }

        Player ownPlayer = getPlayerAtSlot(voter.getSquad(), positionSlot);

        if (ownPlayer != null && ownPlayer.getId().equals(playerId)) {
            throw new IllegalArgumentException(
                    "You cannot vote for a player in your own squad."
            );
        }

        Player selectedPlayer = distinctPlayers.get(playerId);

        if (selectedPlayer == null) {
            throw new IllegalArgumentException(
                    "That player was not selected for this position."
            );
        }

        boolean belongsToOpponent = participants.stream()
                .filter(participant ->
                        !participant.getId().equals(voter.getId()))
                .map(participant ->
                        getPlayerAtSlot(participant.getSquad(), positionSlot))
                .anyMatch(player ->
                        player != null && player.getId().equals(playerId));

        if (!belongsToOpponent) {
            throw new IllegalArgumentException(
                    "You can only vote for a player in another participant's squad."
            );
        }

        BattlePositionVote vote = new BattlePositionVote(
                room,
                voter,
                selectedPlayer,
                positionSlot
        );

        BattlePositionVote savedVote =
                battlePositionVoteRepository.save(vote);

        finishVotingIfComplete(room, participants, positionSlots);
        return savedVote;
    }

    @Transactional(readOnly = true)
    public BattleResultsResponse getResults(String roomCode) {

        BattleRoom room = getRoom(roomCode);

        if (room.getStatus() != BattleRoomStatus.RESULTS) {
            throw new IllegalStateException(
                    "Results are not available yet."
            );
        }

        List<BattleParticipant> participants =
                battleParticipantRepository.findByRoomId(room.getId());

        List<String> positionSlots = getPositionSlots(participants);
        List<BattlePositionVote> votes =
                battlePositionVoteRepository.findByRoomId(room.getId());

        Map<Long, Integer> points = new HashMap<>();
        for (BattleParticipant participant : participants) {
            points.put(participant.getId(), 0);
        }

        List<BattleResultsResponse.PositionResult> positionResults =
                new ArrayList<>();

        for (String slot : positionSlots) {
            Map<Long, Player> distinctPlayers =
                    getDistinctPlayers(participants, slot);

            boolean automatic = distinctPlayers.size() == 1;
            Map<Long, Integer> voteCounts = new HashMap<>();

            for (BattlePositionVote vote : votes) {
                if (vote.getPositionSlot().equals(slot)) {
                    Long selectedId = vote.getPlayer().getId();
                    voteCounts.put(
                            selectedId,
                            voteCounts.getOrDefault(selectedId, 0) + 1
                    );
                }
            }

            List<Long> winningPlayerIds = new ArrayList<>();

            if (automatic) {
                winningPlayerIds.add(
                        distinctPlayers.keySet().iterator().next()
                );
            } else if (!voteCounts.isEmpty()) {
                int highestVotes = voteCounts.values().stream()
                        .max(Integer::compareTo)
                        .orElse(0);

                for (Map.Entry<Long, Integer> entry : voteCounts.entrySet()) {
                    if (entry.getValue() == highestVotes) {
                        winningPlayerIds.add(entry.getKey());
                    }
                }
            }

            List<BattleResultsResponse.Winner> winners =
                    new ArrayList<>();

            for (Long winningPlayerId : winningPlayerIds) {
                Player player = distinctPlayers.get(winningPlayerId);

                List<String> owners = new ArrayList<>();

                for (BattleParticipant participant : participants) {
                    Player selected = getPlayerAtSlot(
                            participant.getSquad(),
                            slot
                    );

                    if (selected != null &&
                            selected.getId().equals(winningPlayerId)) {
                        owners.add(participant.getPlayerName());
                        points.put(
                                participant.getId(),
                                points.getOrDefault(participant.getId(), 0) + 1
                        );
                    }
                }

                winners.add(
                        new BattleResultsResponse.Winner(
                                player.getId(),
                                player.getName(),
                                player.getClub(),
                                player.getPhoto(),
                                owners
                        )
                );
            }

            positionResults.add(
                    new BattleResultsResponse.PositionResult(
                            slot,
                            positionLabel(slot),
                            automatic,
                            winners
                    )
            );
        }

        List<BattleParticipant> orderedParticipants =
                new ArrayList<>(participants);

        orderedParticipants.sort(
                Comparator
                        .comparingInt(
                                (BattleParticipant participant) ->
                                        points.getOrDefault(participant.getId(), 0)
                        )
                        .reversed()
                        .thenComparing(
                                participant -> participant.getPlayerName().toLowerCase()
                        )
        );

        List<BattleRankingResult> rankings = new ArrayList<>();
        int currentRank = 0;
        int previousPoints = -1;

        for (int i = 0; i < orderedParticipants.size(); i++) {
            BattleParticipant participant = orderedParticipants.get(i);
            int totalPoints = points.getOrDefault(participant.getId(), 0);

            if (totalPoints != previousPoints) {
                currentRank = i + 1;
                previousPoints = totalPoints;
            }

            rankings.add(
                    new BattleRankingResult(
                            currentRank,
                            participant.getId(),
                            participant.getPlayerName(),
                            totalPoints
                    )
            );
        }

        return new BattleResultsResponse(rankings, positionResults);
    }

    private BattleRoom getRoom(String roomCode) {
        return battleRoomRepository.findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new IllegalArgumentException("Room not found."));
    }

    private List<String> getPositionSlots(
            List<BattleParticipant> participants) {

        if (participants.isEmpty()) {
            throw new IllegalStateException(
                    "There are no players in this battle."
            );
        }

        BattleParticipant first = participants.get(0);
        if (!first.isSubmitted() || first.getSquad() == null) {
            throw new IllegalStateException(
                    "All participants must submit their squads before voting."
            );
        }

        List<String> slots = first.getSquad().getSquadPlayers()
                .stream()
                .map(SquadPlayer::getPositionSlot)
                .distinct()
                .sorted(Comparator.comparingInt(this::positionOrder))
                .toList();

        if (slots.size() != 11) {
            throw new IllegalStateException(
                    "Each submitted squad must contain 11 different positions."
            );
        }

        Set<String> expected = Set.copyOf(slots);

        for (BattleParticipant participant : participants) {
            if (!participant.isSubmitted() || participant.getSquad() == null) {
                throw new IllegalStateException(
                        "All participants must submit their squads before voting."
                );
            }

            if (participant.getSquad().getFormation() == null ||
                    participants.get(0).getSquad().getFormation() == null ||
                    !participant.getSquad().getFormation().equalsIgnoreCase(
                            participants.get(0).getSquad().getFormation())) {
                throw new IllegalStateException(
                        "All participants must use the same formation."
                );
            }

            Set<String> participantSlots = participant.getSquad()
                    .getSquadPlayers()
                    .stream()
                    .map(SquadPlayer::getPositionSlot)
                    .collect(java.util.stream.Collectors.toSet());

            if (!participantSlots.equals(expected)) {
                throw new IllegalStateException(
                        "All squads must contain the same 11 position slots."
                );
            }
        }

        return slots;
    }

    private int positionOrder(String slot) {
        int index = POSITION_SLOT_ORDER.indexOf(slot);
        return index < 0 ? POSITION_SLOT_ORDER.size() : index;
    }

    private Map<Long, Player> getDistinctPlayers(
            List<BattleParticipant> participants,
            String slot) {

        Map<Long, Player> players = new LinkedHashMap<>();

        for (BattleParticipant participant : participants) {
            Player player = getPlayerAtSlot(participant.getSquad(), slot);

            if (player != null) {
                players.putIfAbsent(player.getId(), player);
            }
        }

        return players;
    }

    private Player getPlayerAtSlot(Squad squad, String slot) {
        if (squad == null || squad.getSquadPlayers() == null) {
            return null;
        }

        return squad.getSquadPlayers()
                .stream()
                .filter(item -> slot.equals(item.getPositionSlot()))
                .map(SquadPlayer::getPlayer)
                .findFirst()
                .orElse(null);
    }

    private String positionLabel(String slot) {
        String base = slot;
        String suffix = "";

        if (slot.matches(".*_[ABC]$")) {
            String letter = slot.substring(slot.length() - 1);
            base = slot.substring(0, slot.length() - 2);
            suffix = " " + (letter.equals("A") ? "1" :
                    letter.equals("B") ? "2" : "3");
        }

        String label = switch (base) {
            case "GK" -> "Goalkeeper";
            case "LB" -> "Left Back";
            case "RB" -> "Right Back";
            case "LWB" -> "Left Wing-back";
            case "RWB" -> "Right Wing-back";
            case "CB" -> "Centre Back";
            case "DM" -> "Defensive Midfielder";
            case "CM" -> "Central Midfielder";
            case "LM" -> "Left Midfielder";
            case "RM" -> "Right Midfielder";
            case "CAM" -> "Attacking Midfielder";
            case "LW" -> "Left Winger";
            case "RW" -> "Right Winger";
            case "ST" -> "Striker";
            default -> base;
        };

        return label + suffix;
    }

    private void finishVotingIfComplete(
            BattleRoom room,
            List<BattleParticipant> participants,
            List<String> positionSlots) {

        long positionsRequiringVotes = positionSlots.stream()
                .filter(slot ->
                        getDistinctPlayers(participants, slot).size() > 1)
                .count();

        long expectedVotes =
                positionsRequiringVotes * participants.size();

        long submittedVotes =
                battlePositionVoteRepository.countByRoomId(room.getId());

        if (submittedVotes >= expectedVotes) {
            room.setStatus(BattleRoomStatus.RESULTS);
            battleRoomRepository.save(room);

            for (BattleParticipant participant : participants) {
                participant.setStatus(BattleParticipantStatus.FINISHED);
                battleParticipantRepository.save(participant);
            }
        }
    }
}
