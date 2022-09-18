// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
import {Base64} from "./libraries/Base64.sol";
import "hardhat/console.sol";

contract POP is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(string => address) public profiles;
    mapping(string => string) public records;

    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="68" y="30" font-size="16" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">Proof-Of-People</text>';
    string svgPartTwo =
        '<text x="68" y="80" font-size="16" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartThree = "</text>";
    string svgPartFour =
        '<text x="68" y="100" font-size="16" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartFive = "</text></svg>";

    mapping(string => address) public profiles;
    mapping(string => string) public records;

    constructor(string memory _tld) payable ERC721("Proof of Protocol", "POP") {
        console.log("%s name service deployed");
    }

    function createProfile(string calldata _name, string memory _role) public {
        string memory finalSvg = string(
            abi.encodePacked(
                svgPartOne,
                svgPartTwo,
                _name,
                svgPartThree,
                svgPartFour,
                _role,
                svgPartFive
            )
        );

        uint256 newRecordId = _tokenIds.current();
        uint256 length = StringUtils.strlen(_name);
        string memory strLen = Strings.toString(length);

        console.log(
            "Registering %s.%s on the contract with tokenID %d",
            name,
            newRecordId
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _name,
                '", "role": "',
                _role,
                '", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '","length":"',
                strLen,
                '"}'
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("Final tokenURI", finalTokenUri);

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        profiles[name] = msg.sender;
        _tokenIds.increment();
    }

    function getAddress(string calldata name) public view returns (address) {
        return profiles[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        require(profiles[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(string calldata name)
        public
        view
        returns (string memory)
    {
        return records[name];
    }
}
