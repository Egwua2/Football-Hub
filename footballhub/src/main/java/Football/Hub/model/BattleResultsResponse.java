package Football.Hub.model;

import java.util.List;

public class BattleResultsResponse {

    private List<BattleRankingResult> rankings;
    private List<PositionResult> positions;

    public BattleResultsResponse() {
    }

    public BattleResultsResponse(
            List<BattleRankingResult> rankings,
            List<PositionResult> positions) {
        this.rankings = rankings;
        this.positions = positions;
    }

    public List<BattleRankingResult> getRankings() {
        return rankings;
    }

    public List<PositionResult> getPositions() {
        return positions;
    }

    public static class PositionResult {

        private String positionSlot;
        private String positionLabel;
        private boolean automatic;
        private List<Winner> winners;

        public PositionResult() {
        }

        public PositionResult(
                String positionSlot,
                String positionLabel,
                boolean automatic,
                List<Winner> winners) {
            this.positionSlot = positionSlot;
            this.positionLabel = positionLabel;
            this.automatic = automatic;
            this.winners = winners;
        }

        public String getPositionSlot() {
            return positionSlot;
        }

        public String getPositionLabel() {
            return positionLabel;
        }

        public boolean isAutomatic() {
            return automatic;
        }

        public List<Winner> getWinners() {
            return winners;
        }
    }

    public static class Winner {

        private Long playerId;
        private String playerName;
        private String club;
        private String photo;
        private List<String> owners;

        public Winner() {
        }

        public Winner(
                Long playerId,
                String playerName,
                String club,
                String photo,
                List<String> owners) {
            this.playerId = playerId;
            this.playerName = playerName;
            this.club = club;
            this.photo = photo;
            this.owners = owners;
        }

        public Long getPlayerId() {
            return playerId;
        }

        public String getPlayerName() {
            return playerName;
        }

        public String getClub() {
            return club;
        }

        public String getPhoto() {
            return photo;
        }

        public List<String> getOwners() {
            return owners;
        }
    }
}
