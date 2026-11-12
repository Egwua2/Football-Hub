package Football.Hub.model;

import java.util.List;

public class BattleVotingOption {

    private String positionSlot;
    private String positionLabel;
    private boolean voted;
    private boolean automatic;
    private String automaticPlayerName;
    private Long selectedPlayerId;
    private List<Candidate> options;

    public BattleVotingOption() {
    }

    public BattleVotingOption(
            String positionSlot,
            String positionLabel,
            boolean voted,
            boolean automatic,
            String automaticPlayerName,
            Long selectedPlayerId,
            List<Candidate> options) {
        this.positionSlot = positionSlot;
        this.positionLabel = positionLabel;
        this.voted = voted;
        this.automatic = automatic;
        this.automaticPlayerName = automaticPlayerName;
        this.selectedPlayerId = selectedPlayerId;
        this.options = options;
    }

    public String getPositionSlot() {
        return positionSlot;
    }

    public String getPositionLabel() {
        return positionLabel;
    }

    public boolean isVoted() {
        return voted;
    }

    public boolean isAutomatic() {
        return automatic;
    }

    public String getAutomaticPlayerName() {
        return automaticPlayerName;
    }

    public Long getSelectedPlayerId() {
        return selectedPlayerId;
    }

    public List<Candidate> getOptions() {
        return options;
    }

    public static class Candidate {

        private Long playerId;
        private String playerName;
        private String club;
        private String position;
        private String nationality;
        private String photo;
        private Integer rating;

        public Candidate() {
        }

        public Candidate(Player player) {
            this.playerId = player.getId();
            this.playerName = player.getName();
            this.club = player.getClub();
            this.position = player.getPosition();
            this.nationality = player.getNationality();
            this.photo = player.getPhoto();
            this.rating = player.getRating();
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

        public String getPosition() {
            return position;
        }

        public String getNationality() {
            return nationality;
        }

        public String getPhoto() {
            return photo;
        }

        public Integer getRating() {
            return rating;
        }
    }
}
