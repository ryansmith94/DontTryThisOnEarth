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
Stores and manipulates comment data.
###
class Comment
	###
	Constructs a new comment.
	@param text comment itself in text.
	@param author user that created the comment.
	@param date and time that the comment was made.
	###
	constructor: (@text, @author, @time) ->

	###
	Converts the Comment to HTML.
	###
	toHTML: () ->
		"""
		<div class="comment">
			<h2 class="text">This is a comment.</h2>
			<div class="author">Posted by <a>Alan</a> 3hrs ago</div>
		</div>
		"""


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
	increaseScore: () -> @score += 1
	
	###
	Decreases the score by one due to down-vote.
	###
	decreaseScore: () -> score -= 1

	###
	Increase reply counter by one for a new reply.
	###
	increaseReplies: () -> replies += 1
	
	###
	Decrease reply counter by one for a deleted reply.
	###
	decreaseReplies: () -> replies -= 1

	###
	Converts the Suggestion to HTML.
	@param currentUser {Boolean} is the user the current user.
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