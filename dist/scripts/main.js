/*
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates user data.
*/


(function() {
  var Comment, Suggestion, User;

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


    Suggestion.prototype.increaseScore = function() {
      return this.score += 1;
    };

    /*
    	Decreases the score by one due to down-vote.
    	@return {Number} the new score (score - 1).
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
        return "<div class=\"suggestion\">\n	<div class=\"votes\">\n		<div class=\"up\"></div>\n		<h2 class=\"score\">" + this.score + "</h2>\n		<div class=\"down\"></div>\n	</div>\n	<div class=\"content\">\n		<h1 class=\"text\">\"" + this.text + "\"</h1>\n		<div class=\"info\">\n			<div class=\"reply\">\n				<div class=\"icon\"></div>" + this.replies + " Replies\n			</div>\n			<div class=\"share\">\n				<div class=\"icon\"></div>" + this.shares + " Shares\n			</div>\n			" + (authorHTML()) + "\n		</div>\n	</div>\n</div>";
      };
    })();

    return Suggestion;

  })();

}).call(this);
