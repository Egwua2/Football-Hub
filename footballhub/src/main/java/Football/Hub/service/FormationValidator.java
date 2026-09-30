package Football.Hub.service;

import Football.Hub.model.Squad;
import Football.Hub.model.SquadPlayer;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FormationValidator {

    private final Map<String, List<String>> formations = new HashMap<>();

    public FormationValidator() {

        formations.put("4-3-3", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "CM_A", "DM", "CM_B",
                "LW", "ST", "RW"
        ));

        formations.put("4-4-2", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "LM", "CM_A", "CM_B", "RM",
                "ST_A", "ST_B"
        ));

        formations.put("4-2-3-1", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "DM_A", "DM_B",
                "CAM_A", "CAM_B", "CAM_C",
                "ST"
        ));

        formations.put("4-1-4-1", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "DM",
                "LM", "CM_A", "CM_B", "RM",
                "ST"
        ));

        formations.put("4-3-2-1", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "CM_A", "DM", "CM_B",
                "CAM_A", "CAM_B",
                "ST"
        ));

        formations.put("4-2-2-2", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "DM_A", "DM_B",
                "CAM_A", "CAM_B",
                "ST_A", "ST_B"
        ));

        formations.put("4-4-1-1", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "LM", "CM_A", "CM_B", "RM",
                "CAM",
                "ST"
        ));

        formations.put("4-3-1-2", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "CM_A", "DM", "CM_B",
                "CAM",
                "ST_A", "ST_B"
        ));

        formations.put("4-1-2-3", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "DM",
                "CM_A", "CM_B",
                "LW", "ST", "RW"
        ));

        formations.put("4-5-1", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "LM", "CM_A", "DM", "CM_B", "RM",
                "ST"
        ));

        formations.put("3-5-2", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "LM", "CM_A", "DM", "CM_B", "RM",
                "ST_A", "ST_B"
        ));

        formations.put("3-4-3", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "LM", "CM_A", "CM_B", "RM",
                "LW", "ST", "RW"
        ));

        formations.put("3-4-1-2", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "LM", "CM_A", "CM_B", "RM",
                "CAM",
                "ST_A", "ST_B"
        ));

        formations.put("3-4-2-1", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "LM", "CM_A", "CM_B", "RM",
                "CAM_A", "CAM_B",
                "ST"
        ));

        formations.put("3-3-3-1", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "DM_A", "DM_B", "DM_C",
                "LW", "CAM", "RW",
                "ST"
        ));

        formations.put("3-1-4-2", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "DM",
                "LM", "CM_A", "CM_B", "RM",
                "ST_A", "ST_B"
        ));

        formations.put("3-2-4-1", List.of(
                "GK",
                "CB_A", "CB_B", "CB_C",
                "DM_A", "DM_B",
                "LM", "CAM_A", "CAM_B", "RM",
                "ST"
        ));

        formations.put("5-3-2", List.of(
                "GK",
                "LWB", "CB_A", "CB_B", "CB_C", "RWB",
                "CM_A", "DM", "CM_B",
                "ST_A", "ST_B"
        ));

        formations.put("5-4-1", List.of(
                "GK",
                "LWB", "CB_A", "CB_B", "CB_C", "RWB",
                "LM", "CM_A", "CM_B", "RM",
                "ST"
        ));

        formations.put("5-2-3", List.of(
                "GK",
                "LWB", "CB_A", "CB_B", "CB_C", "RWB",
                "DM_A", "DM_B",
                "LW", "ST", "RW"
        ));

        formations.put("5-3-1-1", List.of(
                "GK",
                "LWB", "CB_A", "CB_B", "CB_C", "RWB",
                "CM_A", "DM", "CM_B",
                "CAM",
                "ST"
        ));

        formations.put("5-2-1-2", List.of(
                "GK",
                "LWB", "CB_A", "CB_B", "CB_C", "RWB",
                "DM_A", "DM_B",
                "CAM",
                "ST_A", "ST_B"
        ));

        formations.put("4-2-1-3", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "DM_A", "DM_B",
                "CAM",
                "LW", "ST", "RW"
        ));

        formations.put("4-3-3 DM", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "CAM_A", "DM", "CAM_B",
                "LW", "ST", "RW"
        ));

        formations.put("4-3-3 False 9", List.of(
                "GK",
                "LB", "CB_A", "CB_B", "RB",
                "CM_A", "DM", "CM_B",
                "LW", "CF", "RW"
        ));
    }

    public boolean formationExists(String formation) {
        return formations.containsKey(formation);
    }

    public List<String> getFormationPositions(String formation) {
        return formations.getOrDefault(
                formation,
                Collections.emptyList()
        );
    }

    public String validate(Squad squad) {

        if (squad == null) {
            return "Squad not found.";
        }

        String formation = squad.getFormation();

        if (!formationExists(formation)) {
            return "Unsupported formation: " + formation;
        }

        List<String> requiredPositions =
                getFormationPositions(formation);

        List<SquadPlayer> squadPlayers =
                squad.getSquadPlayers();

        if (squadPlayers.size() != 11) {
            return "A starting XI must contain exactly 11 players. Current: "
                    + squadPlayers.size();
        }

        Set<String> occupiedPositions = new HashSet<>();

        for (SquadPlayer squadPlayer : squadPlayers) {

            String slot = squadPlayer.getPositionSlot();

            if (!requiredPositions.contains(slot)) {
                return "Position " + slot
                        + " does not exist in the "
                        + formation + " formation.";
            }

            if (!occupiedPositions.add(slot)) {
                return "Position " + slot
                        + " is occupied more than once.";
            }
        }

        if (occupiedPositions.size() != 11) {
            return "The formation is missing one or more positions.";
        }

        return "Squad is valid for " + formation + ".";
    }
}