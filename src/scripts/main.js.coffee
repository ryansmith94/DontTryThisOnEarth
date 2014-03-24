currentSuggestion = null

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
	@return {Array<Comment>} empty array.
	###
	addComment: (comment) -> @comments.splice(0, 0, comment)

	###
	Converts the suggestion to HTML.
	@param currentUser {Boolean} is the user the current user.
	@return {String} string of HTML representing the suggestion.
	###
	toHTML: (() ->
		user = (author, date) ->
			"""
			<div class="author">Posted by <a href="?user=#{author.name}">#{author.name}</a> #{timeSince(date)}</div>
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
						<div class="reply clickable">
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
			suggestion = this

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
				currentSuggestion = suggestion
			)

			# Reply handler.
			element.find('.reply').click(() -> element.click())

			# Vote up handler.
			element.find('.up').click((event) ->
				event.stopPropagation()
				$(this).toggleClass('selected')
				element.find('.down').removeClass('selected')
				
				curVal = parseInt($(this).parent().find('.score').text())
				$('.up.selected').closest('.score').text(curVal+1)
				# Increase score by 1 using function "voteUp" defined in Suggestion class.
			)

			# Vote down handler.
			element.find('.down').click((event) ->
				event.stopPropagation()
				$(this).toggleClass('selected')
				element.find('.up').removeClass('selected')
				# Increase score by 1 using function "voteUp" defined in Suggestion class.
			)

			# Share Handler.
			element.find('.share').click((event) ->
				event.stopPropagation()
			)

			# Delete Handler.
			element.find('.delete').click((event) ->
				event.stopPropagation()
				# Code goes here.
			)

			# Author handler.
			element.find('.author a').click((event) ->
				event.stopPropagation()
				event.preventDefault() # Stops the URL from changing - in the finished product this is not needed.
				# Code goes here.
			)

			element
	)()

# Start code.
currentUser = new User("User#{(new Date()).valueOf()}", null)
users = [currentUser]
suggestions = []

# Handler to go back to suggestions (useful on mobile).
$('#comments .back').click((event) ->
	event.stopPropagation()
	$('.wrapper').addClass('suggestions')
)

# Load test data.
$.getJSON('init.json').done((data) ->
	suggestionsElement = $('#suggestionsContainer')
	commentsElement = $('#commentsContainer')

	# Constructs the users (from test data) and adds these to any users made before loading test data.
	users = data.users.map((user) ->
		new User(user.name, user.email)
	).concat(users)

	# Constructs the suggestions and comments (from test data).
	suggestions = data.suggestions.map((suggestion) ->
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
)

# Sign in helper function.
signIn = (user) ->
	currentUser = user
	$('.navbar-nav').addClass('signedIn')

# Sign in handler.
$('#signIn').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	email = $(this).find('#email').val()

	user = users.filter((user) ->
		user.email is email
	)[0]

	if user? then signIn(user) else alert('That username does not exist. Please try a different username.')
)

# Sign up handler.
$('#signUp').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	email = $(this).find('#email').val()
	username = $(this).find('#username').val()

	user = users.filter((user) ->
		(user.email is email) or (user.name is username)
	)[0]

	if not (user?)
		currentUser.email = email
		currentUser.name = username
		signIn(currentUser)
	else if (user.email is email)
		alert('A user with that email address already exists. Please try a different email.')
	else
		alert('A user with that username already exists. Please try a different username.')
)

# Sign out handler.
$('.signOut').click((event) ->
	event.stopPropagation()
	event.preventDefault()
	currentUser = null
	$('.navbar-nav').removeClass('signedIn')
)

# Post suggestion handler.
$('#postSuggestion').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	text = $(this).find('#text').val()
	suggestion = new Suggestion(text, 0, [], 0, currentUser, new Date())
	suggestions.splice(0, 0, suggestion)
	$('#suggestionsContainer').prepend(suggestion.toHTML())
)

# Post comment handler.
$('#postComment').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	text = $(this).find('#text').val()
	comment = new Comment(text, currentUser, new Date())
	currentSuggestion.addComment(comment)
	$('#commentsContainer').prepend(comment.toHTML())
)