/*
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates user data.
*/


(function() {
  var Comment, Suggestion, User;

  User = (function() {
    /*
    	Constructs a new user.
    	@param name user's name on the website.
    	@param email user's email address.
    */

    function User(name, email) {
      this.name = name;
      this.email = email;
    }

    User.prototype.getUserName = function() {
      return this.name;
    };

    User.prototype.getEmail = function() {
      return this.email;
    };

    return User;

  })();

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
  Stores and manipulates comment data.
  */


  Comment = (function() {
    /*
    	Constructs a new comment.
    	@param text comment itself in text.
    	@param author user that created the comment.
    	@param date and time that the comment was made.
    */

    function Comment(text, author, time) {
      this.text = text;
      this.author = author;
      this.time = time;
    }

    /*
    	Converts the Comment to HTML.
    */


    Comment.prototype.toHTML = function() {
      return "<div class=\"comment\">\n	<h2 class=\"text\">This is a comment.</h2>\n	<div class=\"author\">Posted by <a>Alan</a> 3hrs ago</div>\n</div>";
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
    	@param text suggestion itself in text.
    	@param score number votes up subtracted by the number of votes down.
    	@param replies number of comments on the suggestion.
    	@param shares number of times the suggestion was shared.
    	@param author user that created the suggestion.
    	@param date and time that the suggestion was made.
    */

    function Suggestion(text, score, replies, shares, author, time) {
      this.text = text;
      this.score = score;
      this.replies = replies;
      this.shares = shares;
      this.author = author;
      this.time = time;
    }

    /*
    	Replaces the text and time of a suggestion
    	@param text, suggestion is text and will replace existing one
    	@param time, replace time with new time
    */


    Suggestion.prototype.editSuggestion = function(text, time) {
      this.text = text;
      this.time = time;
    };

    /*
    	Increase the score by one due to up-vote.
    */


    Suggestion.prototype.increaseScore = function() {
      return this.score += 1;
    };

    /*
    	Decreases the score by one due to down-vote.
    */


    Suggestion.prototype.decreaseScore = function() {
      return score -= 1;
    };

    /*
    	Increase reply counter by one for a new reply.
    */


    Suggestion.prototype.increaseReplies = function() {
      return replies += 1;
    };

    /*
    	Decrease reply counter by one for a deleted reply.
    */


    Suggestion.prototype.decreaseReplies = function() {
      return replies -= 1;
    };

    /*
    	Converts the Suggestion to HTML.
    	@param currentUser {Boolean} is the user the current user.
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
        return "<div class=\"suggestion\">\n	<div class=\"votes\">\n		<div class=\"up\"></div>\n		<h2 class=\"score\">" + this.score + "</h2>\n		<div class=\"down\"></div>\n	</div>\n	<div class=\"content\">\n		<h1 class=\"text\">\"" + this.text + "\"</h1>\n		<div class=\"info\">\n			<div class=\"reply\">\n				<div class=\"icon\"></div>" + this.replies + " Replies\n			</div>\n			<div class=\"share\">\n				<div class=\"icon\"></div>" + this.shares + " Shares\n			</div>\n			" + (authorHTML()) + "\n		</div>\n	</div>\n</div>";
      };
    })();

    return Suggestion;

  })();

}).call(this);
