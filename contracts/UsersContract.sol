// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract UsersContract {

    struct User {
        string name;
        string surname;
    }

    mapping(address => User) private users;
    mapping(address => bool) private joinedUsers;
    address[] total;

    //event OnUserJoin(address, string);
    
    function join(string memory _name, string memory _surname) public {
        require(!userJoined(msg.sender)); //Requerimos que el usuario NO esté unido previamente
        User storage user = users[msg.sender];
        user.name = _name;
        user.surname = _surname;
        joinedUsers[msg.sender] = true;
        total.push(msg.sender);

        //emit OnUserJoin(msg.sender, string(abi.encodePacked(_name, " ", _surname)));
        //Para poder concaternar texto, debemos usar la función string() y abi.encodePacked(args)
        //Donde le pasamos los parámtros a concaternar
    }

    function getUser(address _addr) public view returns (string memory, string memory) {
        require(userJoined(msg.sender)); //Requerimos que el usuario SI esté unido previamente
        User memory user = users[_addr];
        return (user.name, user.surname);
    }

    function userJoined(address _addr) private view returns (bool) { //el memory solo se utiliza para arrays o structs
        return joinedUsers[_addr];
    }

    function totalUsers() public view returns (uint) {
        return total.length;
    }
}