/*
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates user data.
*/


(function() {
  var Comment, Suggestion, User, main;

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
      return "<div class=\"comment\">\n	<h2 class=\"text\">" + this.text + "</h2>\n	<div class=\"author\">Posted by <a>" + user.name + "</a> " + this.date + "</div>\n</div>";
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
      var author, bin;
      author = function() {
        return "<div class=\"author\">Posted by <a>" + this.author + "</a> " + this.time + "</div>";
      };
      bin = function() {
        return "<div class=\"delete\">\n  <div class=\"icon\"></div>Delete\n</div>";
      };
      return function(currentUser) {
        var authorHTML;
        authorHTML = currentUser ? bin : author;
        return "<div class=\"suggestion\">\n	<div class=\"votes\">\n		<div class=\"up\"></div>\n		<h2 class=\"score\">" + this.score + "</h2>\n		<div class=\"down\"></div>\n	</div>\n	<div class=\"content\">\n		<h1 class=\"text\">\"" + this.text + "\"</h1>\n		<div class=\"info\">\n			<div class=\"reply\">\n				<div class=\"icon\"></div>" + this.comments.length + " Replies\n			</div>\n			<div class=\"share\">\n				<div class=\"icon\"></div>" + this.shares + " Shares\n			</div>\n			" + (authorHTML()) + "\n		</div>\n	</div>\n</div>";
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
      suggestion.comments = suggestion.comments.map(function(comment) {
        return new Comment(comment.text, users[comment.author], comment.date);
      });
      return new Suggestion(suggestion.text, suggestion.score, suggestion.comments, suggestion.shares, suggestion.author, suggestion.date);
    });
    suggestions.forEach(function(suggestion) {
      return suggestionsElement.append(suggestion.toHTML());
    });
    return $('.suggestion').first().addClass('selected');
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

  $('.suggestion').click(function(event) {
    event.stopPropagation();
    $('.suggestion.selected').removeClass('selected');
    return $(this).addClass('selected');
  });

  $('.down').click(function(event) {
    event.stopPropagation();
    return $(this).toggleClass('selected');
  });

  $('.up').click(function(event) {
    event.stopPropagation();
    return $(this).toggleClass('selected');
  });

  $('.navbar-nav').click(function(event) {
    return $('.btn').click(function(event) {
      return $(this).submit();
    });
  });

  $('.navbar-nav').click(function(event) {
    return $(this).toggleClass('signedIn');
  });

  $("#suggestions").click(function(event) {
    return $(this).toggleClass('allUsers');
  });

}).call(this);
