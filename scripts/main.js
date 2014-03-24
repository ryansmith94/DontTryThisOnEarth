/*
@author Ryan Smith <12034191@brookes.ac.uk>. Sky Sanders <http://stackoverflow.com/users/242897/sky-sanders>
Adapted from [Stack Overflow](http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site).
@param date {Date} the date that something was done.
*/


(function() {
  var Comment, Suggestion, User, main, timeSince;

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
      return "<div class=\"comment\">\n	<h2 class=\"text\">" + this.text + "</h2>\n	<div class=\"author\">Posted by <a>" + this.author.name + "</a> " + (timeSince(this.date)) + "</div>\n</div>";
    };

    return Comment;

  })();

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
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
      this.author = author != null ? author : null;
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
      return this.score += 1;
    };

    /*
    	Decreases the score by one due to down-vote.
    	@return {Number} the new score (score - 1).
    */


    Suggestion.prototype.voteDown = function() {
      return this.score -= 1;
    };

    /*
    	Increase reply counter by one for a new reply.
    	@param comment {Comment} the comment to be added.
    	@return {Array<Comment>} the array of comments about the suggestion.
    */


    Suggestion.prototype.addComment = function(comment) {
      return this.comments.push(comment);
    };

    /*
    	Converts the suggestion to HTML.
    	@param currentUser {Boolean} is the user the current user.
    	@return {String} string of HTML representing the suggestion.
    */


    Suggestion.prototype.toHTML = (function() {
      var bin, user;
      user = function(author, date) {
        return "<div class=\"author\">Posted by <a>" + author.name + "</a> " + (timeSince(date)) + "</div>";
      };
      bin = function() {
        return "<div class=\"delete\">\n  <div class=\"icon\"></div>Delete\n</div>";
      };
      return function(currentUser, id) {
        var authorHTML, comments, element;
        authorHTML = currentUser ? bin : user;
        element = $("<div class=\"suggestion\" data-suggestion=\"" + id + "\">\n	<div class=\"votes\">\n		<div class=\"up\"></div>\n		<h2 class=\"score\">" + this.score + "</h2>\n		<div class=\"down\"></div>\n	</div>\n	<div class=\"content\">\n		<h1 class=\"text\">\"" + this.text + "\"</h1>\n		<div class=\"info\">\n			<div class=\"reply\">\n				<div class=\"icon\"></div>" + this.comments.length + " Replies\n			</div>\n			<div class=\"share\">\n				<div class=\"icon\"></div>" + this.shares + " Shares\n				<div class=\"shareDropDown\">\n					<a>Facebook</a>\n					<a>Twitter</a>\n				</div>\n			</div>\n			" + (authorHTML(this.author, this.date)) + "\n		</div>\n	</div>\n</div>");
        comments = this.comments;
        element.click(function(event) {
          var commentsElement;
          event.stopPropagation();
          $('.suggestion.selected').removeClass('selected');
          $(this).addClass('selected');
          commentsElement = $('#comments');
          commentsElement.children('.comment').remove();
          return comments.forEach(function(comment) {
            return commentsElement.append(comment.toHTML());
          });
        });
        element.find('.up').click(function(event) {
          event.stopPropagation();
          return $(this).toggleClass('selected');
        });
        element.find('.down').click(function(event) {
          event.stopPropagation();
          return $(this).toggleClass('selected');
        });
        return element;
      };
    })();

    return Suggestion;

  })();

  main = function(data) {
    var commentsElement, suggestions, suggestionsElement, users;
    suggestions = data.suggestions;
    users = data.users;
    suggestionsElement = $('#suggestions');
    commentsElement = $('#comments');
    users = users.map(function(user) {
      return new User(user.name, user.email);
    });
    suggestions = suggestions.map(function(suggestion) {
      suggestion.author = users[suggestion.author];
      suggestion.date = new Date(suggestion.date);
      suggestion.comments = suggestion.comments.map(function(comment) {
        return new Comment(comment.text, users[comment.author], new Date(comment.date));
      });
      return new Suggestion(suggestion.text, suggestion.score, suggestion.comments, suggestion.shares, suggestion.author, suggestion.date);
    });
    suggestions.forEach(function(suggestion, id) {
      return suggestionsElement.append(suggestion.toHTML(false, id));
    });
    return $('.suggestion').first().click();
  };

  (function() {
    var cookies;
    cookies = Cookies('demo');
    if (cookies != null) {
      return main(JSON.parse(cookies));
    } else {
      return $.getJSON('init.json').done(main);
    }
  })();

  /*
  # @Ryan Do I even need this?
  # Submit form
  $('.navbar-nav').click((event) ->
  	$('.btn').click((event)->
  		$(this).submit()
  	)
  )
  
  # @Ryan Ignores the sign in form?
  # Toggle .signedIn on .navbar-nav to change menu
  $('.navbar-nav').click((event) ->
  	$(this).toggleClass('signedIn')
  )
  
  # @Ryan Is this meant to change when a user clicks on a Suggestion?
  # @Ryan It currently toggles when u click on grey areas (the wrapper).
  # Toggle .suggestions on .wrapper to switch between comments and suggestions on mobile
  # $('.wrapper').click((event) -> 
  # 	$(this).toggleClass('suggestions')
  # )
  
  # @Ryan All this does is show the div with "View all Suggestions by user..."
  # @Ryan How I link to suggestions posted by a certain user?
  # Toggle .allUsers on #suggestions to switch between suggestions from a single user and all users
  $("#suggestions").click((event) ->
  	$(this).toggleClass('allUsers')
  )
  */


}).call(this);
