package Football.Hub.service;

import Football.Hub.model.BattleParticipant;
import Football.Hub.model.BattleParticipantStatus;
import Football.Hub.model.BattleRankingResult;
import Football.Hub.model.BattleRoom;
import Football.Hub.model.BattleRoomStatus;
import Football.Hub.model.BattleVote;
import Football.Hub.model.BattleVotingOption;
import Football.Hub.model.Player;
import Football.Hub.model.Squad;
import Football.Hub.model.SquadPlayer;
import Football.Hub.repository.BattleParticipantRepository;
import Football.Hub.repository.BattleRoomRepository;
import Football.Hub.repository.BattleVoteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BattleVotingService {

    private final BattleRoomRepository battleRoomRepository;
    private final BattleParticipantRepository battleParticipantRepository;
    private final BattleVoteRepository battleVoteRepository;

    public BattleVotingService(
            BattleRoomRepository battleRoomRepository,
            BattleParticipantRepository battleParticipantRepository,
            BattleVoteRepository battleVoteRepository) {

        this.battleRoomRepository = battleRoomRepository;
        this.battleParticipantRepository = battleParticipantRepository;
        this.battleVoteRepository = battleVoteRepository;
    }

    public List<BattleVotingOption> getVotingOptions(
            String roomCode,
            String voterName) {

        BattleRoom room =
                battleRoomRepository.findByRoomCode(roomCode)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Room not found."
                                ));

        if (room.getStatus() != BattleRoomStatus.VOTING) {
            throw new IllegalStateException(
                    "Voting is not currently active."
            );
        }

        BattleParticipant voter =
                battleParticipantRepository
                        .findByRoomIdAndPlayerName(
                                room.getId(),
                                voterName
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Player is not in this room."
                                ));

        List<BattleParticipant> participants =
                battleParticipantRepository
                        .findByRoomId(room.getId());

        List<BattleVotingOption> options =
                new ArrayList<>();

        int labelNumber = 1;

        for (BattleParticipant participant : participants) {

            if (participant.getId().equals(voter.getId())) {
                continue;
            }

            if (!participant.isSubmitted() ||
                    participant.getSquad() == null) {
                continue;
            }

            options.add(
                    new BattleVotingOption(
                            participant.getId(),
                            "Squad " + labelNumber,
                            participant.getSquad()
                    )
            );

            labelNumber++;
        }

        return options;
    }

    public BattleVote castVote(
            String roomCode,
            String voterName,
            Long votedForId) {

        BattleRoom room =
                battleRoomRepository.findByRoomCode(roomCode)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Room not found."
                                ));

        if (room.getStatus() != BattleRoomStatus.VOTING) {
            throw new IllegalStateException(
                    "Voting is not currently active."
            );
        }

        BattleParticipant voter =
                battleParticipantRepository
                        .findByRoomIdAndPlayerName(
                                room.getId(),
                                voterName
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Voter is not in this room."
                                ));

        BattleParticipant votedFor =
                battleParticipantRepository
                        .findById(votedForId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Player being voted for was not found."
                                ));

        if (!votedFor.getRoom().getId().equals(room.getId())) {
            throw new IllegalArgumentException(
                    "That player is not in this battle."
            );
        }

        if (voter.getId().equals(votedFor.getId())) {
            throw new IllegalArgumentException(
                    "You cannot vote for yourself."
            );
        }

        if (!votedFor.isSubmitted() ||
                votedFor.getSquad() == null) {
            throw new IllegalStateException(
                    "That player has not submitted a squad."
            );
        }

        if (battleVoteRepository
                .findByRoomIdAndVoterId(
                        room.getId(),
                        voter.getId()
                )
                .isPresent()) {

            throw new IllegalStateException(
                    "You have already voted."
            );
        }

        BattleVote vote =
                new BattleVote(
                        room,
                        voter,
                        votedFor
                );

        BattleVote savedVote =
                battleVoteRepository.save(vote);

        long totalPlayers =
                battleParticipantRepository
                        .countByRoomId(room.getId());

        long totalVotes =
                battleVoteRepository
                        .countByRoomId(room.getId());

        if (totalVotes == totalPlayers) {

            room.setStatus(BattleRoomStatus.RESULTS);
            battleRoomRepository.save(room);

            List<BattleParticipant> participants =
                    battleParticipantRepository
                            .findByRoomId(room.getId());

            for (BattleParticipant participant :
                    participants) {

                participant.setStatus(
                        BattleParticipantStatus.FINISHED
                );

                battleParticipantRepository.save(participant);
            }
        }

        return savedVote;
    }

    public List<BattleRankingResult> getRanking(
            String roomCode) {

        BattleRoom room =
                battleRoomRepository.findByRoomCode(roomCode)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Room not found."
                                ));

        if (room.getStatus() != BattleRoomStatus.RESULTS) {
            throw new IllegalStateException(
                    "Results are not available yet."
            );
        }

        List<BattleParticipant> participants =
                battleParticipantRepository
                        .findByRoomId(room.getId());

        List<BattleVote> votes =
                battleVoteRepository
                        .findByRoomId(room.getId());

        Map<Long, Integer> voteCounts =
                new HashMap<>();

        for (BattleParticipant participant :
                participants) {

            voteCounts.put(
                    participant.getId(),
                    0
            );
        }

        for (BattleVote vote : votes) {

            Long participantId =
                    vote.getVotedFor().getId();

            voteCounts.put(
                    participantId,
                    voteCounts.getOrDefault(
                            participantId,
                            0
                    ) + 1
            );
        }

        List<BattleRankingResult> results =
                new ArrayList<>();

        for (BattleParticipant participant :
                participants) {

            double squadScore =
                    calculateSquadScore(
                            participant.getSquad()
                    );

            results.add(
                    new BattleRankingResult(
                            0,
                            participant.getId(),
                            participant.getPlayerName(),
                            voteCounts.getOrDefault(
                                    participant.getId(),
                                    0
                            ),
                            squadScore
                    )
            );
        }

        results.sort(
                Comparator
                        .comparingInt(
                                BattleRankingResult::getVotes
                        )
                        .reversed()
                        .thenComparing(
                                BattleRankingResult::getSquadScore,
                                Comparator.reverseOrder()
                        )
        );

        List<BattleRankingResult> rankedResults =
                new ArrayList<>();

        for (int i = 0; i < results.size(); i++) {

            BattleRankingResult result =
                    results.get(i);

            rankedResults.add(
                    new BattleRankingResult(
                            i + 1,
                            result.getParticipantId(),
                            result.getPlayerName(),
                            result.getVotes(),
                            result.getSquadScore()
                    )
            );
        }

        return rankedResults;
    }

    private double calculateSquadScore(Squad squad) {

        if (squad == null ||
                squad.getSquadPlayers() == null ||
                squad.getSquadPlayers().isEmpty()) {

            return 0;
        }

        double total = 0;
        int count = 0;

        for (SquadPlayer squadPlayer :
                squad.getSquadPlayers()) {

            Player player =
                    squadPlayer.getPlayer();

            if (player != null &&
                    player.getRating() != null) {

                total += player.getRating();
                count++;
            }
        }

        if (count == 0) {
            return 0;
        }

        return Math.round(
                (total / count) * 100
        ) / 100.0;
    }
}