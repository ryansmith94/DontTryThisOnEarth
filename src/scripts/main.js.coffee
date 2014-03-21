###
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates user data.
###
class User
	###
	Constructs a new user.
	@param name {String} user's name on the website.
	@param email {String} user's email address.
	###
	constructor: (@name, @email) ->


###
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates comment data.
###
class Comment
	###
	Constructs a new comment.
	@param text {String} comment itself in text.
	@param author {User} user that created the comment.
	@param date {Date} when the comment was made.
	###
	constructor: (@text, @author, @date) ->

	###
	Converts the comment to HTML.
	@return {String} string of HTML representing the comment.
	###
	toHTML: () ->
		"""
		<div class="comment">
			<h2 class="text">#{@text}</h2>
			<div class="author">Posted by <a>#{user.name}</a> #{@date}</div>
		</div>
		"""


###
@author Ryan Smith <12034191@brookes.ac.uk>
Stores and manipulates suggestion data.
###
class Suggestion
	###
	Constructs a new suggestion.
	@param text {String} suggestion itself in text.
	@param score {Number} number votes up subtracted by the number of votes down.
	@param comments {Array<Comment>} array of comments made about the suggestion.
	@param shares {Number} number of times the suggestion was shared.
	@param author {User} who made the suggestion.
	@param date {Date} when the suggestion was made.
	###
	constructor: (@text = '', @score = 0, @comments = [], @shares = 0, @author = null, @date = null) ->

	###
	Replaces the text and time of a suggestion
	@param text {String suggestion itself in text.
	@param date {Date} when the suggestion was modified.
	@return {Suggestion} the current suggestion.
	###
	editSuggestion: (@text, @date) -> @
	
	###
	Increase the score by one due to up-vote.
	@return {Number} the new score (score + 1).
	###
	voteUp: () -> @score += 1
	
	###
	Decreases the score by one due to down-vote.
	@return {Number} the new score (score - 1).
	###
	voteDown: () -> @score -= 1

	###
	Increase reply counter by one for a new reply.
	@param comment {Comment} the comment to be added.
	@return {Array<Comment>} the array of comments about the suggestion.
	###
	addComment: (comment) -> @comments.push(comment)

	###
	Converts the suggestion to HTML.
	@param currentUser {Boolean} is the user the current user.
	@return {String} string of HTML representing the suggestion.
	###
	toHTML: (() ->
		author = () ->
			"""
			<div class="author">Posted by <a>#{@author}</a> #{@time}</div>
			"""

		bin = () ->
			"""
			<div class="delete">
			  <div class="icon"></div>Delete
			</div>
			"""

		(currentUser) ->
			authorHTML = if currentUser then bin else author
			"""
			<div class="suggestion">
				<div class="votes">
					<div class="up"></div>
					<h2 class="score">#{@score}</h2>
					<div class="down"></div>
				</div>
				<div class="content">
					<h1 class="text">"#{@text}"</h1>
					<div class="info">
						<div class="reply">
							<div class="icon"></div>#{@replies} Replies
						</div>
						<div class="share">
							<div class="icon"></div>#{@shares} Shares
						</div>
						#{authorHTML()}
					</div>
				</div>
			</div>
			"""
	)()

# Selects suggestions.
$('.suggestion').click((event) ->
	event.stopPropagation() # Stops the event bubbling up to parent handlers.
	$('.suggestion.selected').removeClass('selected')
	$(this).toggleClass('selected')
)

# Toggle .signedIn on .navbar-nav to change menu
# Toggle .suggestions on .wrapper to switch between comments and suggestions on mobile
# Toggle .allUsers on #suggestions to switch between suggestions from a single user and all users
# @Tim you do not need to add any classes and you shouldn't really need to add any IDs to Jade
# @Tim use data-attributes (http://ejohn.org/blog/html-5-data-attributes/) where possible
# @Tim data-attributes can be used to reference array indexes such as suggestions[arrayIndex] - we'll do this later