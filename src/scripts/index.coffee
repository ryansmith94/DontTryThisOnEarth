###
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates user data.
###
class User
	###
	Constructs a new user.
	@param name user's name on the website.
	@param email user's email address.
	###
	constructor: (@name, @email) ->
	
	getUserName: () -> @name
	
	getEmail: () -> @email

###
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates suggestion data.
###
class Suggestion
	###
	Constructs a new suggestion.
	@param text suggestion itself in text.
	@param score number votes up subtracted by the number of votes down.
	@param replies number of comments on the suggestion.
	@param shares number of times the suggestion was shared.
	@param author user that created the suggestion.
	@param date and time that the suggestion was made.
	###
	constructor: (@text, @score, @replies, @shares, @author, @time) ->

	###
	Replaces the text and time of a suggestion
	@param text, suggestion is text and will replace existing one
	@param time, replace time with new time
	###
	editSuggestion: (@text, @time) -> 
	
	###
	Increase the score by one due to up-vote.
	###
	increaseScore() -> @score+=1
	
	###
	Decreases the score by one due to down-vote.
	###
	decreaseScore() -> score-=1

	###
	Increase reply counter by one for a new reply.
	###
	increaseReplies() -> replies+=1
	
	###
	Decrease reply counter by one for a deleted reply.
	###
	decreaseReplies() -> replies-=1
	
	
###
@author Ryan Smith <12034191@brookes.ac.uk>
Displays and manipulates suggestions (by the current user) via the user interface.
###
class SuggestionElement
	###
	Constructs a new suggestion element.
	@param suggestion the suggestion to be displayed and manipulated.
	###
	constructor: (@suggestion) ->

	###
	Produces HTML for displaying the suggestion.
	@return suggestion as HTML.
	###
	toHtml: () ->
		"""
		<div class="suggestion">
		  <div class="votes">
		    <div class="up"></div>
		    <h2 class="score">#{@suggestion.score}</h2>
		    <div class="down"></div>
		  </div>
		  <div class="content">
		    <h1 class="text">"#{@suggestion.text}"</h1>
		    <div class="info">
		      <div class="reply">
		        <div class="icon"></div>#{@suggestion.replies} Replies
		      </div>
		      <div class="share">
		        <div class="icon"></div>#{@suggestion.shares} Shares
		      </div>
		      #{@authorHTML()}
		    </div>
		  </div>
		</div>
		"""

	###
	Produces HTML for a delete button to remove the suggestion.
	@return delete button in HTML.
	###
	authorHTML: () ->
		"""
        <div class="delete">
          <div class="icon"></div>Delete
        </div>
        """


###
@author Ryan Smith <12034191@brookes.ac.uk>
Displays and manipulates suggestions (by other users) via the user interface.
###
class ExternalSuggestionElement extends SuggestionElement
	###
	Produces HTML for displaying the author and when the suggestion was made.
	@return author and time posted as HTML.
	###
	authorHTML: () ->
		"""
		<div class="author">Posted by <a>#{@suggestion.author}</a> #{@suggestion.time}</div>
		"""



