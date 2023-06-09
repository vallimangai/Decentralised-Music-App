// SPDX-License-Identifier: MIT
// pragma solidity >=0.8.18;
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Music {
    struct Track {
        string title;
        string ipfslink;
        address payable  artist;
        address payable  distributor;
        uint256 royalties;
        uint256 plays;
    }

    mapping (uint256 => Track)  tracks;
    uint256 public totalTracks;

    event NewTrack(uint256 indexed trackId, string title, string ipfslink, address indexed artist, address indexed distributor, uint256 royalties);
    event TrackPlayed(uint256 indexed trackId, uint256 plays);

    function addTrack(string memory _title,  string memory _ipfslink,address payable _artist, address payable _distributor,uint256 _royalties) public returns (uint256) {
        require(_artist != address(0), "Invalid artist address");
        require(_distributor != address(0), "Invalid distributor address");
        require(_royalties > 0, "Invalid royalties");

        uint256 trackId = totalTracks;
        tracks[trackId] = Track(_title,_ipfslink, _artist, _distributor, _royalties, 0);

        totalTracks++;
        emit NewTrack(trackId, _title,_ipfslink, _artist, _distributor, _royalties);

        return trackId;
    }

    function displayTrackDetails(uint256 _trackId) public view returns (string memory, string memory,address, address, uint256, uint256) {
        require(_trackId < totalTracks, "Invalid track ID");

        Track memory track = tracks[_trackId];
        return (track.title,track.ipfslink,track.artist, track.distributor, track.royalties, track.plays);
    }
    function getAllTracks() public view returns (Track[] memory) {
        Track[] memory allTracks = new Track[](totalTracks);

        for (uint256 i = 0; i < totalTracks; i++) {
            allTracks[i] = tracks[i];
        }

        return allTracks;
    }
   function playTrack(uint256 _trackId) public payable returns (string memory) {
        require(_trackId < totalTracks, "Invalid track ID");
        uint256 amount = tracks[_trackId].royalties;
        require(msg.value >= amount, "Insufficient payment");
        amount=msg.value;
        tracks[_trackId].plays++;
        emit TrackPlayed(_trackId, tracks[_trackId].plays);

        tracks[_trackId].artist.transfer(amount-(amount/10));

        // Distributor gets a percentage of the royalties
        uint256 distributorShare = amount / 10;
        tracks[_trackId].distributor.transfer(distributorShare);
       
        return tracks[_trackId].title;

    }

}
