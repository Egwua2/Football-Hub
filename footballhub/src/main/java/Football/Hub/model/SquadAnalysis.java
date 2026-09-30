package Football.Hub.model;

import java.util.ArrayList;
import java.util.List;

public class SquadAnalysis {

    private Long squadId;
    private String squadName;
    private String formation;

    private int playerCount;
    private int requiredPlayers;

    private boolean complete;
    private boolean valid;

    private int positionFitScore;
    private int overallScore;

    private List<String> positions = new ArrayList<>();
    private List<String> occupiedPositions = new ArrayList<>();
    private List<String> missingPositions = new ArrayList<>();

    private List<PositionFitResult> playerAnalysis = new ArrayList<>();

    private String message;

    public SquadAnalysis() {
    }

    public Long getSquadId() {
        return squadId;
    }

    public void setSquadId(Long squadId) {
        this.squadId = squadId;
    }

    public String getSquadName() {
        return squadName;
    }

    public void setSquadName(String squadName) {
        this.squadName = squadName;
    }

    public String getFormation() {
        return formation;
    }

    public void setFormation(String formation) {
        this.formation = formation;
    }

    public int getPlayerCount() {
        return playerCount;
    }

    public void setPlayerCount(int playerCount) {
        this.playerCount = playerCount;
    }

    public int getRequiredPlayers() {
        return requiredPlayers;
    }

    public void setRequiredPlayers(int requiredPlayers) {
        this.requiredPlayers = requiredPlayers;
    }

    public boolean isComplete() {
        return complete;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public int getPositionFitScore() {
        return positionFitScore;
    }

    public void setPositionFitScore(int positionFitScore) {
        this.positionFitScore = positionFitScore;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public List<String> getPositions() {
        return positions;
    }

    public void setPositions(List<String> positions) {
        this.positions = positions;
    }

    public List<String> getOccupiedPositions() {
        return occupiedPositions;
    }

    public void setOccupiedPositions(List<String> occupiedPositions) {
        this.occupiedPositions = occupiedPositions;
    }

    public List<String> getMissingPositions() {
        return missingPositions;
    }

    public void setMissingPositions(List<String> missingPositions) {
        this.missingPositions = missingPositions;
    }

    public List<PositionFitResult> getPlayerAnalysis() {
        return playerAnalysis;
    }

    public void setPlayerAnalysis(
            List<PositionFitResult> playerAnalysis) {

        this.playerAnalysis = playerAnalysis;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}