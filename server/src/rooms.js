const RoomStatus = {
    CREATED: 'created',
    STARTED: 'started',
    FINISHED: 'finished'
}

let rooms = []

const createRoom = (room, username) => {
    let newRoom = {
        name: room,
        status: RoomStatus.CREATED,
        owner: username,
        players: {
            left: null,
            right: null
        }
    }

    rooms.push(newRoom);
    return newRoom;
}

const getRooms = () => {
    return rooms;
}

const getRoomByName = (roomName) => {
    const index = rooms.findIndex((room) => room.name === roomName);
    return rooms[index];
}

const updateRoom = (roomName, room) => {
    const index = rooms.findIndex((room) => room.name === roomName);
    rooms[index] = room;
}

const deleteRoom = (roomName) => {
    rooms = rooms.filter((room) => room.name !== roomName);
}


module.exports = {RoomStatus, createRoom, getRooms, deleteRoom, getRoomByName, updateRoom }