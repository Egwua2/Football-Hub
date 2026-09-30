package Football.Hub.service;

import Football.Hub.model.Player;
import Football.Hub.model.Squad;
import Football.Hub.model.SquadPlayer;
import Football.Hub.repository.PlayerRepository;
import Football.Hub.repository.SquadPlayerRepository;
import Football.Hub.repository.SquadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SquadService {

    private final SquadRepository squadRepository;
    private final SquadPlayerRepository squadPlayerRepository;
    private final PlayerRepository playerRepository;
    private final FormationValidator formationValidator;

    public SquadService(
            SquadRepository squadRepository,
            SquadPlayerRepository squadPlayerRepository,
            PlayerRepository playerRepository,
            FormationValidator formationValidator) {

        this.squadRepository = squadRepository;
        this.squadPlayerRepository = squadPlayerRepository;
        this.playerRepository = playerRepository;
        this.formationValidator = formationValidator;
    }

    /*
     * Get every saved squad.
     */
    public List<Squad> getAllSquads() {
        return squadRepository.findAll();
    }

    /*
     * Get one squad.
     */
    public Squad getSquadById(Long id) {
        return squadRepository.findById(id).orElse(null);
    }

    /*
     * Create a new squad.
     */
    public Squad createSquad(
            String name,
            String formation,
            String managerName) {

        if (!formationValidator.formationExists(formation)) {
            throw new IllegalArgumentException(
                    "Unsupported formation: " + formation
            );
        }

        Squad squad =
                new Squad(
                        name,
                        formation
                );

        squad.setManagerName(managerName);

        return squadRepository.save(squad);
    }

    /*
     * Add any player to any valid formation slot.
     *
     * IMPORTANT:
     * Squad Builder does NOT calculate position suitability.
     */
    public Squad addPlayerToSquad(
            Long squadId,
            Long playerId,
            String positionSlot) {

        Squad squad =
                getSquadById(squadId);

        if (squad == null) {
            throw new IllegalArgumentException(
                    "Squad not found."
            );
        }

        Player player =
                playerRepository
                        .findById(playerId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Player not found."
                                ));

        /*
         * Make sure the slot belongs to
         * the selected formation.
         */
        List<String> validPositions =
                formationValidator
                        .getFormationPositions(
                                squad.getFormation()
                        );

        if (!validPositions.contains(positionSlot)) {
            throw new IllegalArgumentException(
                    "Position " + positionSlot
                            + " does not exist in the "
                            + squad.getFormation()
                            + " formation."
            );
        }

        /*
         * One player per slot.
         */
        if (squadPlayerRepository
                .findBySquadIdAndPositionSlot(
                        squadId,
                        positionSlot
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Position " + positionSlot
                            + " is already occupied."
            );
        }

        /*
         * A player cannot appear twice
         * in the same starting XI.
         */
        if (squadPlayerRepository
                .existsBySquadIdAndPlayerId(
                        squadId,
                        playerId
                )) {

            throw new IllegalArgumentException(
                    "This player is already in the squad."
            );
        }

        SquadPlayer squadPlayer =
                new SquadPlayer(
                        squad,
                        player,
                        positionSlot
                );

        squadPlayerRepository.save(
                squadPlayer
        );

        return squad;
    }

    /*
     * Remove a player from a squad.
     */
    public void removePlayerFromSquad(
            Long squadId,
            Long playerId) {

        Squad squad =
                getSquadById(squadId);

        if (squad == null) {
            throw new IllegalArgumentException(
                    "Squad not found."
            );
        }

        SquadPlayer squadPlayer =
                squadPlayerRepository
                        .findBySquadIdAndPlayerId(
                                squadId,
                                playerId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Player is not in this squad."
                                ));

        squadPlayerRepository.delete(
                squadPlayer
        );
    }

    /*
     * Remove whoever occupies a specific slot.
     */
    public void removePlayerFromPosition(
            Long squadId,
            String positionSlot) {

        Squad squad =
                getSquadById(squadId);

        if (squad == null) {
            throw new IllegalArgumentException(
                    "Squad not found."
            );
        }

        SquadPlayer squadPlayer =
                squadPlayerRepository
                        .findBySquadIdAndPositionSlot(
                                squadId,
                                positionSlot
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No player is assigned to "
                                                + positionSlot
                                ));

        squadPlayerRepository.delete(
                squadPlayer
        );
    }

    /*
     * Get all players currently inside a squad.
     */
    public List<SquadPlayer> getSquadPlayers(
            Long squadId) {

        if (!squadRepository.existsById(squadId)) {
            throw new IllegalArgumentException(
                    "Squad not found."
            );
        }

        return squadPlayerRepository
                .findBySquadId(squadId);
    }

    /*
     * Delete an entire saved squad.
     */
    public void deleteSquad(Long squadId) {

        if (!squadRepository.existsById(squadId)) {
            throw new IllegalArgumentException(
                    "Squad not found."
            );
        }

        squadRepository.deleteById(
                squadId
        );
    }
}