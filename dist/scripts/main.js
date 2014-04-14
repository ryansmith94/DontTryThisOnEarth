(function() {
  var Comment, Suggestion, User, anonymousUser, currentSuggestion, currentSuggestionElement, currentUser, showSuggestions, signIn, stopTrip, suggestions, timeSince, trip, users;

  currentSuggestion = null;

  currentSuggestionElement = null;

  trip = null;

  stopTrip = function() {
    if ((trip != null) && (trip.stop != null)) {
      return trip.stop();
    }
  };

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>. Sky Sanders <http://stackoverflow.com/users/242897/sky-sanders>
  Adapted from [Stack Overflow](http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site).
  @param date {Date} the date that something was done.
  */


  timeSince = function(date) {
    var interval, seconds;
    seconds = Math.floor((new Date() - date) / 1000);
    interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return "" + interval + " years ago";
    } else if ((interval = Math.floor(seconds / 2592000)) > 1) {
      return "" + interval + " months ago";
    } else if ((interval = Math.floor(seconds / 86400)) > 1) {
      return "" + interval + " days ago";
    } else if ((interval = Math.floor(seconds / 3600)) > 1) {
      return "" + interval + " hours ago";
    } else if ((interval = Math.floor(seconds / 60)) > 1) {
      return "" + interval + " minutes ago";
    } else {
      return "" + (Math.floor(seconds)) + " seconds ago";
    }
  };

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
  Stores and manipulates user data.
  */


  User = (function() {
    /*
    	Constructs a new user.
    	@param name {String} user's name on the website.
    	@param email {String} user's email address.
    */

    function User(name, email) {
      this.name = name;
      this.email = email;
      this.ups = [];
      this.downs = [];
    }

    return User;

  })();

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
  Stores and manipulates comment data.
  */


  Comment = (function() {
    /*
    	Constructs a new comment.
    	@param text {String} comment itself in text.
    	@param author {User} user that created the comment.
    	@param date {Date} when the comment was made.
    */

    function Comment(text, author, date) {
      this.text = text;
      this.author = author;
      this.date = date;
    }

    /*
    	Converts the comment to HTML.
    	@return {String} string of HTML representing the comment.
    */


    Comment.prototype.toHTML = function() {
      var comment, element;
      element = $("<div class=\"comment\">\n	<h2 class=\"text\">" + this.text + "</h2>\n	<div class=\"author\">Posted by <a>" + this.author.name + "</a> " + (timeSince(this.date)) + "</div>\n</div>");
      comment = this;
      element.find('.author a').click(function(event) {
        event.stopPropagation();
        /* Stops the URL from changing - in the finished product this is not needed.*/

        event.preventDefault();
        showSuggestions(comment.author);
        return stopTrip();
      });
      return element;
    };

    return Comment;

  })();

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
  @author Timon Wan <12038068@brookes.ac.uk>
  Stores and manipulates suggestion data.
  */


  Suggestion = (function() {
    /*
    	Constructs a new suggestion.
    	@param text {String} suggestion itself in text.
    	@param score {Number} number votes up subtracted by the number of votes down.
    	@param comments {Array<Comment>} array of comments made about the suggestion.
    	@param shares {Number} number of times the suggestion was shared.
    	@param author {User} who made the suggestion.
    	@param date {Date} when the suggestion was made.
    */

    function Suggestion(text, score, comments, shares, author, date) {
      this.text = text != null ? text : '';
      this.score = score != null ? score : 0;
      this.comments = comments != null ? comments : [];
      this.shares = shares != null ? shares : 0;
      this.author = author != null ? author : {};
      this.date = date != null ? date : null;
    }

    /*
    	Replaces the text and time of a suggestion
    	@param text {String suggestion itself in text.
    	@param date {Date} when the suggestion was modified.
    	@return {Suggestion} the current suggestion.
    */


    Suggestion.prototype.editSuggestion = function(text, date) {
      this.text = text;
      this.date = date;
      return this;
    };

    /*
    	Increase the score by one due to up-vote.
    	@return {Number} the new score (score + 1).
    */


    Suggestion.prototype.voteUp = function() {
      var index;
      currentUser.ups.push(this);
      index = currentUser.downs.indexOf(this);
      if (index !== -1) {
        currentUser.downs.splice(index, 1);
        this.score += 1;
      }
      return this.score += 1;
    };

    /*
    	Decreases the score by one due to down-vote.
    	@return {Number} the new score (score - 1).
    */


    Suggestion.prototype.voteDown = function() {
      var index;
      currentUser.downs.push(this);
      index = currentUser.ups.indexOf(this);
      if (index !== -1) {
        currentUser.ups.splice(index, 1);
        this.score -= 1;
      }
      return this.score -= 1;
    };

    /*
    	Remove previous vote.
    */


    Suggestion.prototype.unVote = function() {
      /* Remove down vote.*/

      var index;
      index = currentUser.downs.indexOf(this);
      if (index !== -1) {
        currentUser.downs.splice(index, 1);
        this.score += 1;
      }
      /* Remove up vote.*/

      index = currentUser.ups.indexOf(this);
      if (index !== -1) {
        currentUser.ups.splice(index, 1);
        return this.score -= 1;
      }
    };

    /*
    	Increase reply counter by one for a new reply.
    	@param comment {Comment} the comment to be added.
    	@return {Array<Comment>} empty array.
    */


    Suggestion.prototype.addComment = function(comment) {
      return this.comments.splice(0, 0, comment);
    };

    /*
    	Converts the suggestion to HTML.
    	@param currentUser {Boolean} is the user the current user.
    	@return {String} string of HTML representing the suggestion.
    */


    Suggestion.prototype.toHTML = (function() {
      var bin, user;
      user = function(author, date) {
        return "<div class=\"author\">Posted by <a href=\"?user=" + author.name + "\">" + author.name + "</a> " + (timeSince(date)) + "</div>";
      };
      bin = function() {
        return "<div title=\"Delete the suggestion\" class=\"delete clickable\">\n  <div class=\"icon\"></div>Delete\n</div>";
      };
      return function() {
        var authorHTML, element, suggestion;
        authorHTML = currentUser === this.author ? bin : user;
        element = $("<div class=\"suggestion\">\n	<div class=\"votes\">\n		<div title=\"Vote up\" class=\"up " + (currentUser.ups.indexOf(this) !== -1 ? 'selected' : '') + "\"></div>\n		<h2 title=\"Score ('up votes' subtracted by 'down votes')\" class=\"score\"><span id=\"score\">" + this.score + "</span> Score</h2>\n		<div title=\"Vote down\" class=\"down " + (currentUser.downs.indexOf(this) !== -1 ? 'selected' : '') + "\"></div>\n	</div>\n	<div class=\"content\">\n		<h1 class=\"text\">\"" + this.text + "\"</h1>\n		<div class=\"info\">\n			<div title=\"View the replies\" class=\"reply clickable\">\n				<div class=\"icon\"></div><span class=\"number\">" + this.comments.length + "</span> Replies\n			</div>\n			<div class=\"share\">\n				<div title=\"Share the suggestion\" class=\"icon\"></div><span class=\"number\">" + this.shares + "</span> Shares\n				<div class=\"shareDropDown\">\n					<a title=\"Share to Facebook\">Facebook</a>\n					<a title=\"Share to Twitter\">Twitter</a>\n				</div>\n			</div>\n			" + (authorHTML(this.author, this.date)) + "\n		</div>\n	</div>\n</div>");
        suggestion = this;
        /* Select handler.*/

        element.click(function(event) {
          /* Stops the event bubbling up to parent handlers.*/

          var commentsElement;
          event.stopPropagation();
          stopTrip();
          $('.suggestion.selected').removeClass('selected');
          $(this).addClass('selected');
          commentsElement = $('#commentsContainer');
          commentsElement.empty();
          if (suggestion.comments.length > 0) {
            suggestion.comments.forEach(function(comment) {
              return commentsElement.append(comment.toHTML());
            });
            $('#comments .empty').hide();
          } else {
            $('#comments .empty').show();
          }
          $('.wrapper').removeClass('suggestions');
          currentSuggestion = suggestion;
          return currentSuggestionElement = element;
        });
        /* Reply handler.*/

        element.find('.reply').click(function() {
          return element.click();
        });
        /* Vote up handler.*/

        element.find('.up').click(function(event) {
          event.stopPropagation();
          stopTrip();
          if (!$(this).hasClass('selected')) {
            suggestion.voteUp();
          } else {
            suggestion.unVote();
          }
          $(this).toggleClass('selected');
          $(this).parent().find('#score').text(suggestion.score);
          return element.find('.down').removeClass('selected');
        });
        /* Vote down handler.*/

        element.find('.down').click(function(event) {
          event.stopPropagation();
          stopTrip();
          if (!$(this).hasClass('selected')) {
            suggestion.voteDown();
          } else {
            suggestion.unVote();
          }
          $(this).toggleClass('selected');
          $(this).parent().find('#score').text(suggestion.score);
          return element.find('.up').removeClass('selected');
        });
        /* Share Handler.*/

        element.find('.share').click(function(event) {
          event.stopPropagation();
          stopTrip();
          suggestion.shares += 1;
          return $(this).children('.number').text(suggestion.shares);
        });
        /* Delete Handler.*/

        element.find('.delete').click(function(event) {
          event.stopPropagation();
          stopTrip();
          if (confirm('Are you sure want to delete?') === true) {
            $(this).parent().parent().parent().remove();
            if (suggestion === currentSuggestion) {
              $('.suggestion').first().click();
            }
            suggestions.splice(suggestions.indexOf(suggestion), 1);
            if ($('.suggestion').length = 0) {
              $('#suggestions .empty').show();
              $('#postComment').hide();
              $('#comments .noSuggestion').show();
              return $('#comments .empty').hide();
            }
          }
        });
        /* Author handler.*/

        element.find('.author a').click(function(event) {
          event.stopPropagation();
          /* Stops the URL from changing - in the finished product this is not needed.*/

          event.preventDefault();
          stopTrip();
          return showSuggestions(suggestion.author);
        });
        return element;
      };
    })();

    return Suggestion;

  })();

  /* Start code.*/


  anonymousUser = new User("User" + ((new Date()).valueOf()), null);

  currentUser = anonymousUser;

  users = [currentUser];

  suggestions = [];

  /* Handler to go back to suggestions from comments (useful on mobile).*/


  $('#comments .back').click(function(event) {
    event.stopPropagation();
    stopTrip();
    return $('.wrapper').addClass('suggestions');
  });

  /* Handler to go back to suggestions from user's suggestions.*/


  $('#suggestions .back').click(function(event) {
    event.stopPropagation();
    stopTrip();
    return showSuggestions();
  });

  showSuggestions = function(user) {
    var suggestionsElement;
    suggestionsElement = $('#suggestionsContainer');
    suggestionsElement.empty();
    $('#commentsContainer').empty();
    suggestions.forEach(function(suggestion) {
      if ((user == null) || suggestion.author === user) {
        return suggestionsElement.append(suggestion.toHTML());
      }
    });
    if (user != null) {
      $('#suggestions').removeClass('allUsers');
      $('#suggestions .user .name').text(user.name);
    } else {
      $('#suggestions').addClass('allUsers');
    }
    if ($('.suggestion').length > 0) {
      $('.suggestion').first().click();
      $('#comments .back').click();
      $('#suggestions .empty').hide();
      $('#comments .noSuggestion').hide();
      return $('#postComment').show();
    } else {
      $('#suggestions .empty').show();
      $('#postComment').hide();
      $('#comments .noSuggestion').show();
      return $('#comments .empty').hide();
    }
  };

  /* Load test data.*/


  $.getJSON('init.json').done(function(data) {
    /* Constructs the users (from test data) and adds these to any users made before loading test data.*/

    users = data.users.map(function(user) {
      return new User(user.name, user.email);
    }).concat(users);
    /* Constructs the suggestions and comments (from test data).*/

    suggestions = data.suggestions.map(function(suggestion) {
      suggestion.author = users[suggestion.author];
      suggestion.date = new Date(suggestion.date);
      suggestion.comments = suggestion.comments.map(function(comment) {
        return new Comment(comment.text, users[comment.author], new Date(comment.date));
      });
      return new Suggestion(suggestion.text, suggestion.score, suggestion.comments, suggestion.shares, suggestion.author, suggestion.date);
    });
    return showSuggestions();
  });

  /* Sign in helper function.*/


  signIn = function(user) {
    currentUser = user;
    $('.navbar-nav').addClass('signedIn');
    return showSuggestions();
  };

  /* Sign in handler.*/


  $('#signIn').submit(function(event) {
    var email, user;
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    email = $(this).find('#email').val();
    user = users.filter(function(user) {
      return user.email === email;
    })[0];
    if (user != null) {
      return signIn(user);
    } else {
      return alert('That username does not exist. Please try a different username.');
    }
  });

  /* Sign up handler.*/


  $('#signUp').submit(function(event) {
    var email, user, username;
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    email = $(this).find('#email').val();
    username = $(this).find('#username').val();
    user = users.filter(function(user) {
      return (user.email === email) || (user.name === username);
    })[0];
    if (!(user != null)) {
      currentUser.email = email;
      currentUser.name = username;
      return signIn(currentUser);
    } else if (user.email === email) {
      return alert('A user with that email address already exists. Please try a different email.');
    } else {
      return alert('A user with that username already exists. Please try a different username.');
    }
  });

  /* Sign out handler.*/


  $('.signOut').click(function(event) {
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    currentUser = anonymousUser;
    $('.navbar-nav').removeClass('signedIn');
    return showSuggestions();
  });

  /* View user's suggestions handler.*/


  $('.viewSuggestions').click(function(event) {
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    return showSuggestions(currentUser);
  });

  /* Post suggestion handler.*/


  $('#postSuggestion').submit(function(event) {
    var suggestion, text;
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    text = $(this).find('#text').val();
    suggestion = new Suggestion(text, 0, [], 0, currentUser, new Date());
    suggestions.splice(0, 0, suggestion);
    $(this).find('.cancel').click();
    $('#suggestionsContainer').prepend(suggestion.toHTML(true));
    $('#suggestions .empty').hide();
    return $(this).find('#text').val('');
  });

  /* Post comment handler.*/


  $('#postComment').submit(function(event) {
    var comment, text;
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    text = $(this).find('#text').val();
    comment = new Comment(text, currentUser, new Date());
    currentSuggestion.addComment(comment);
    $('#commentsContainer').prepend(comment.toHTML());
    $(this).find('.cancel').click();
    currentSuggestionElement.find('.reply .number').text(currentSuggestion.comments.length);
    $('#comments .empty').hide();
    return $(this).find('#text').val('');
  });

  /* Cancel handler.*/


  $('form .cancel').click(function(event) {
    event.stopPropagation();
    stopTrip();
    return $(this).parent().children('#text').val("");
  });

  /* Submit handler.*/


  $('form .submit').click(function(event) {
    event.stopPropagation();
    stopTrip();
    return $(this).submit();
  });

  /* Help handler.*/


  $('#help').click(function(event) {
    var $suggestions, content;
    event.stopPropagation();
    stopTrip();
    content = function(sel, content, position) {
      if ((sel != null) && sel.length > 0) {
        return {
          sel: sel,
          content: content,
          expose: true,
          position: position || 's'
        };
      } else {
        return null;
      }
    };
    $suggestions = $('.suggestion');
    trip = new Trip([content($('#postSuggestion'), 'Enter a new suggestion here'), content($suggestions.find('.up'), 'Toggle up vote for suggestion', 'e'), content($suggestions.find('.down'), 'Toggle down vote for suggestion', 'e'), content($suggestions.find('.score'), 'The current score', 'e'), content($suggestions.find('.reply'), 'Tap to comment on the suggestion'), content($suggestions.find('.share'), 'Tap to share suggestion to social networks'), content($suggestions.find('.delete'), 'Tap to delete the suggestion'), content($('.author a'), 'Tap to view suggestions from the author'), content($suggestions.find('.text'), 'Tap to view comments on the suggestion'), content(($('.navbar-toggle').is(":visible") ? null : $('#postComment')), 'Enter a new comment here'), content(($('.navbar-toggle').is(":visible") ? null : $('.viewSuggestions')), 'Tap to view your suggestions'), content(($('.navbar-toggle').is(":visible") ? null : $('.noAccount#signIn')), 'Tap to sign in'), content(($('.navbar-toggle').is(":visible") ? null : $('.noAccount#signUp')), 'Tap to sign up')].filter(function(x) {
      return x != null;
    }), {
      showNavigation: true,
      delay: -1,
      overlayZindex: 2,
      animation: null,
      showCloseBox: true
    });
    return trip.start();
  });

  /* View all suggestions handler.*/


  $('.navbar .logo, .navbar .name').click(function(event) {
    event.stopPropagation();
    event.preventDefault();
    stopTrip();
    return showSuggestions();
  });

}).call(this);
