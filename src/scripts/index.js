/*
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates user data.
*/


(function() {
  var ExternalSuggestionElement, Suggestion, SuggestionElement, User, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

    return User;

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

    return Suggestion;

  })();

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
  Displays and manipulates suggestions (by the current user) via the user interface.
  */


  SuggestionElement = (function() {
    /*
    	Constructs a new suggestion element.
    	@param suggestion the suggestion to be displayed and manipulated.
    */

    function SuggestionElement(suggestion) {
      this.suggestion = suggestion;
    }

    /*
    	Produces HTML for displaying the suggestion.
    	@return suggestion as HTML.
    */


    SuggestionElement.prototype.toHtml = function() {
      return "<div class=\"suggestion\">\n  <div class=\"votes\">\n    <div class=\"up\"></div>\n    <h2 class=\"score\">" + this.suggestion.score + "</h2>\n    <div class=\"down\"></div>\n  </div>\n  <div class=\"content\">\n    <h1 class=\"text\">\"" + this.suggestion.text + "\"</h1>\n    <div class=\"info\">\n      <div class=\"reply\">\n        <div class=\"icon\"></div>" + this.suggestion.replies + " Replies\n      </div>\n      <div class=\"share\">\n        <div class=\"icon\"></div>" + this.suggestion.shares + " Shares\n      </div>\n      " + (this.authorHTML()) + "\n    </div>\n  </div>\n</div>";
    };

    /*
    	Produces HTML for a delete button to remove the suggestion.
    	@return delete button in HTML.
    */


    SuggestionElement.prototype.authorHTML = function() {
      return "<div class=\"delete\">\n  <div class=\"icon\"></div>Delete\n</div>";
    };

    return SuggestionElement;

  })();

  /*
  @author Ryan Smith <12034191@brookes.ac.uk>
  Displays and manipulates suggestions (by other users) via the user interface.
  */


  ExternalSuggestionElement = (function(_super) {
    __extends(ExternalSuggestionElement, _super);

    function ExternalSuggestionElement() {
      _ref = ExternalSuggestionElement.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /*
    	Produces HTML for displaying the author and when the suggestion was made.
    	@return author and time posted as HTML.
    */


    ExternalSuggestionElement.prototype.authorHTML = function() {
      return "<div class=\"author\">Posted by <a>" + this.suggestion.author + "</a> " + this.suggestion.time + "</div>";
    };

    return ExternalSuggestionElement;

  })(SuggestionElement);

}).call(this);
