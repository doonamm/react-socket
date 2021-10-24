const c_users = [];

//join user to the specific chatroom
function join_user(id, username, room){
    const p_user = {id, username, room};

    c_users.push(p_user);
    console.log('users: ', c_users);

    return p_user;
}

console.log('user out', c_users);

function get_current_user(id){
    return c_users.find(p_user => p_user.id === id);
}

function user_disconnect(id){
    const index = c_users.findIndex(p_user => p_user.id === id);

    if(index !== -1){
        return c_users.splice(index, 1);
    }
}

module.exports = {
    join_user,
    get_current_user,
    user_disconnect
}