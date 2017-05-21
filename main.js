'use strict';

(function($){

    var $users = $('.users'),
        $friends = $('.friends'),
        $acquaintances = $('.acquaintances'),
        $suggested = $('.suggested'),
        $searchUser = $('.searchUser'),

        users = [];

    function init() {
        $.get('data.json')
            .done(function(data){
                users = data;
                render(users, $users, true);
                bindEvents();
            })
            .fail(function(error){
                alert('Could not get data');
            });
    }

    function bindEvents() {
        $searchUser.on('keyup', searchUser);
    }

    function searchUser(e) {
        var filterUsers = users.filter(function(user){
            return user.firstName.startsWith($searchUser.val()) || user.surname.startsWith($searchUser.val())
        });
        render(filterUsers, $users, true);
    }

    function selectUser(_user){
        var userFriendsId = [],
            userFriends = [];

        userFriends = users.filter(function(user){
            return user.id !== _user.id && _user.friends.indexOf(user.id) >= 0;
        });

        render(userFriends, $friends, true);

        searchAcquaintances(userFriends, _user);

        searchSuggested(userFriends.map(function(user){return user.id}), _user);
    }

    function searchAcquaintances(userFriends, _user) {
        var acquaintances = [];

        userFriends.forEach(function(friend){
            friend.friends.forEach(function(idFriendOfFriend){
            var currentUser = null,
                isAcquaintanc = null,
                isUserFriend = null;

                currentUser = users.find(function(user){
                    return user.id !== friend.id && user.id !== _user.id && idFriendOfFriend === user.id;
                });

                if(currentUser) {
                    isAcquaintanc  = acquaintances.find(function(acquaintanc){ return  acquaintanc.id === currentUser.id; });
                    isUserFriend  = userFriends.find(function(friend){ return  friend.id === currentUser.id; });

                    if(!isAcquaintanc && !isUserFriend) {
                        acquaintances.push(currentUser);
                    }

                }


            });
        });

        render(acquaintances, $acquaintances, false)
    }

    function searchSuggested(friends, _user) {
        var suggested = [];

        suggested = users.filter(function(user){
            var knownFriends = (user.friends.filter(function(idFriend){
                return friends.indexOf(idFriend) >= 0 && _user.id !== idFriend;
            }));
            return knownFriends.length >= 2 && _user.id !== user.id;
        });

        render(suggested, $suggested)
    }

    function render(users, $row, addEvent) {
        $row.html('');
        var _this = this;
        users.forEach(function(user){
            var $userDiv = $('<div></div>');
            $userDiv.html(user.firstName + ' ' + user.surname);
            if(addEvent){
                $userDiv.on('click', selectUser.bind(_this, user)).css({"color:red"});
            }
            $row.append($userDiv);
        });
    }

    init();

})(jQuery);