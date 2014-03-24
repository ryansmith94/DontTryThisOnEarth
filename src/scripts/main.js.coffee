###
@author Ryan Smith <12034191@brookes.ac.uk>. Sky Sanders <http://stackoverflow.com/users/242897/sky-sanders>
Adapted from [Stack Overflow](http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site).
@param date {Date} the date that something was done.
###
timeSince = (date) ->
	seconds = Math.floor((new Date() - date) / 1000)
	interval = Math.floor(seconds / 31536000)

	if interval > 1 
		"#{interval} years ago"
	else if (interval = Math.floor(seconds / 2592000)) > 1
		"#{interval} months ago"
	else if (interval = Math.floor(seconds / 86400)) > 1
		"#{interval} days ago"
	else if (interval = Math.floor(seconds / 3600)) > 1 
		"#{interval} hours ago"
	else if (interval = Math.floor(seconds / 60)) > 1
		"#{interval} minutes ago"
	else
		"#{Math.floor(seconds)} seconds ago"


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
			<div class="author">Posted by <a>#{@author.name}</a> #{timeSince(@date)}</div>
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
		user = (author, date) ->
			"""
			<div class="author">Posted by <a>#{author.name}</a> #{timeSince(date)}</div>
			"""

		bin = () ->
			"""
			<div class="delete">
			  <div class="icon"></div>Delete
			</div>
			"""

		(currentUser, id) ->
			authorHTML = if currentUser then bin else user
			element = $("""
			<div class="suggestion" data-suggestion="#{id}">
				<div class="votes">
					<div class="up"></div>
					<h2 class="score">#{@score}</h2>
					<div class="down"></div>
				</div>
				<div class="content">
					<h1 class="text">"#{@text}"</h1>
					<div class="info">
						<div class="reply">
							<div class="icon"></div>#{@comments.length} Replies
						</div>
						<div class="share">
							<div class="icon"></div>#{@shares} Shares
							<div class="shareDropDown">
								<a>Facebook</a>
								<a>Twitter</a>
							</div>
						</div>
						#{authorHTML(@author, @date)}
					</div>
				</div>
			</div>
			""")

			comments = @comments

			# Select handler.
			element.click((event) ->
				event.stopPropagation() # Stops the event bubbling up to parent handlers.
				$('.suggestion.selected').removeClass('selected')
				$(this).addClass('selected')

				commentsElement = $('#commentsContainer')
				commentsElement.children('.comment').remove()
				comments.forEach((comment) ->
					commentsElement.append(comment.toHTML())
				)

				$('.wrapper').removeClass('suggestions')
			)

			# Vote up handler.
			element.find('.up').click((event) ->
				event.stopPropagation()
				$(this).toggleClass('selected')
				# Need to remove 'selected' on .down
				# Increase score by 1 using function "voteUp" defined in Suggestion class.
			)

			# Vote down handler.
			element.find('.down').click((event) ->
				event.stopPropagation()
				$(this).toggleClass('selected')
				# Need to remove 'selected' on .down
				# Increase score by 1 using function "voteUp" defined in Suggestion class.
			)

			# Share Handler
			element.find('.share').click((event) ->
				event.stopPropagation()
			)

			element
	)()

# Start code.
$('#comments .back').click((event) ->
	event.stopPropagation()
	$('.wrapper').addClass('suggestions')
)

main = (data) ->
	suggestions = data.suggestions
	users = data.users
	suggestionsElement = $('#suggestionsContainer')
	commentsElement = $('#commentsContainer')

	users = users.map((user) ->
		new User(user.name, user.email)
	)

	suggestions = suggestions.map((suggestion) ->
		suggestion.author = users[suggestion.author]
		suggestion.date = new Date(suggestion.date)
		suggestion.comments = suggestion.comments.map((comment) ->
			new Comment(comment.text, users[comment.author], new Date(comment.date))
		)
		new Suggestion(suggestion.text, suggestion.score, suggestion.comments, suggestion.shares, suggestion.author, suggestion.date)
	)

	suggestions.forEach((suggestion, id) ->
		suggestionsElement.append(suggestion.toHTML(false, id))
	)
	$('.suggestion').first().click()
	$('#comments .back').click()

(() ->
	cookies = Cookies('demo')
	if cookies?
		main(JSON.parse(cookies))
	else
		$.getJSON('init.json').done(main)
)()



###
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
###

# Cancel Suggestion
# Post Suggestion
# Delete Suggestions
# Add a comment
# Share a Suggestion 

# @Tim you do not need to add any classes and you shouldn't really need to add any IDs to Jade
# @Tim use data-attributes (http://ejohn.org/blog/html-5-data-attributes/) where possible
# @Tim data-attributes can be used to reference array indexes such as suggestions[arrayIndex] - we'll do this later