currentSuggestion = null
currentSuggestionElement = null

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
		@ups = []
		@downs = []


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
		element = $("""
		<div class="comment">
			<h2 class="text">#{@text}</h2>
			<div class="author">Posted by <a>#{@author.name}</a> #{timeSince(@date)}</div>
		</div>
		""")

		comment = this;

		element.find('.author a').click((event) ->
			event.stopPropagation()
			### Stops the URL from changing - in the finished product this is not needed. ###
			event.preventDefault()

			showSuggestions(comment.author)
		)

		element


###
@author Ryan Smith <12034191@brookes.ac.uk>
@author Timon Wan <12038068@brookes.ac.uk>
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
	voteUp: () ->
		currentUser.ups.push(this)
		index = currentUser.downs.indexOf(this)
		if index isnt -1
			currentUser.downs.splice(index, 1)
			@score += 1
		@score += 1

	###
	Decreases the score by one due to down-vote.
	@return {Number} the new score (score - 1).
	###
	voteDown: () ->
		currentUser.downs.push(this)
		index = currentUser.ups.indexOf(this)
		if index isnt -1
			currentUser.ups.splice(index, 1)
			@score -= 1
		@score -= 1

	###
	Remove previous vote.
	###
	unVote: () ->
		### Remove down vote. ###
		index = currentUser.downs.indexOf(this)
		if index isnt -1
			currentUser.downs.splice(index, 1)
			@score += 1

		### Remove up vote. ###
		index = currentUser.ups.indexOf(this)
		if index isnt -1
			currentUser.ups.splice(index, 1)
			@score -= 1


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
			<div title="Delete the suggestion" class="delete clickable">
			  <div class="icon"></div>Delete
			</div>
			"""

		() ->
			authorHTML = if currentUser is @author then bin else user
			element = $("""
			<div class="suggestion">
				<div class="votes">
					<div title="Vote up" class="up #{if currentUser.ups.indexOf(this) isnt -1 then 'selected' else ''}"></div>
					<h2 title="Score ('up votes' subtracted by 'down votes')" class="score">#{@score}</h2>
					<div title="Vote down" class="down #{if currentUser.downs.indexOf(this) isnt -1 then 'selected' else ''}"></div>
				</div>
				<div class="content">
					<h1 class="text">"#{@text}"</h1>
					<div class="info">
						<div title="View the replies" class="reply clickable">
							<div class="icon"></div><span class="number">#{@comments.length}</span> Replies
						</div>
						<div class="share">
							<div title="Share the suggestion" class="icon"></div><span class="number">#{@shares}</span> Shares
							<div class="shareDropDown">
								<a title="Share to Facebook">Facebook</a>
								<a title="Share to Twitter">Twitter</a>
							</div>
						</div>
						#{authorHTML(@author, @date)}
					</div>
				</div>
			</div>
			""")

			suggestion = this

			### Select handler. ###
			element.click((event) ->
				### Stops the event bubbling up to parent handlers. ###
				event.stopPropagation()

				$('.suggestion.selected').removeClass('selected')
				$(this).addClass('selected')

				commentsElement = $('#commentsContainer')
				commentsElement.empty()
				if suggestion.comments.length > 0
					suggestion.comments.forEach((comment) ->
						commentsElement.append(comment.toHTML())
					)
					$('#comments .empty').hide()
				else
					$('#comments .empty').show()

				$('.wrapper').removeClass('suggestions')
				currentSuggestion = suggestion
				currentSuggestionElement = element
			)

			### Reply handler. ###
			element.find('.reply').click(() -> element.click())

			### Vote up handler. ###
			element.find('.up').click((event) ->
				event.stopPropagation()

				if not $(this).hasClass('selected')
					suggestion.voteUp()
				else
					suggestion.unVote()

				$(this).toggleClass('selected')
				$(this).parent().find('.score').text(suggestion.score)
				element.find('.down').removeClass('selected')
			)

			### Vote down handler. ### 
			element.find('.down').click((event) ->
				event.stopPropagation()

				if not $(this).hasClass('selected')
					suggestion.voteDown()
				else
					suggestion.unVote()

				$(this).toggleClass('selected')
				$(this).parent().find('.score').text(suggestion.score)
				element.find('.up').removeClass('selected'))

			### Share Handler. ###
			element.find('.share').click((event) ->
				event.stopPropagation()
				suggestion.shares += 1
				$(this).children('.number').text(suggestion.shares)
			)

			### Delete Handler. ###
			element.find('.delete').click((event) ->
				event.stopPropagation()
				if confirm('Are you sure want to delete?') is true
					$(this).parent().parent().parent().remove()
					if suggestion is currentSuggestion
						$('.suggestion').first().click()
					suggestions.splice(suggestions.indexOf(suggestion), 1)
					if $('.suggestion').length = 0
						$('#suggestions .empty').show()
						$('#postComment').hide()
						$('#comments .noSuggestion').show()
						$('#comments .empty').hide()
			)

			### Author handler. ###
			element.find('.author a').click((event) ->
				event.stopPropagation()
				### Stops the URL from changing - in the finished product this is not needed. ###
				event.preventDefault()

				showSuggestions(suggestion.author)
			)

			element
	)()

### Start code. ###
anonymousUser = new User("User#{(new Date()).valueOf()}", null)
currentUser = anonymousUser
users = [currentUser]
suggestions = []

### Handler to go back to suggestions from comments (useful on mobile). ###
$('#comments .back').click((event) ->
	event.stopPropagation()
	$('.wrapper').addClass('suggestions')
)

### Handler to go back to suggestions from user's suggestions. ###
$('#suggestions .back').click((event) ->
	event.stopPropagation()
	showSuggestions()
)

showSuggestions = (user) ->
	suggestionsElement = $('#suggestionsContainer');
	suggestionsElement.empty()
	$('#commentsContainer').empty()

	suggestions.forEach((suggestion) ->
		if (not user?) or suggestion.author is user
			suggestionsElement.append(suggestion.toHTML())
	)

	if user?
		$('#suggestions').removeClass('allUsers')
		$('#suggestions .user .name').text(user.name)
	else
		$('#suggestions').addClass('allUsers')

	if $('.suggestion').length > 0
		$('.suggestion').first().click()
		$('#comments .back').click()
		$('#suggestions .empty').hide()
		$('#comments .noSuggestion').hide()
		$('#postComment').show()
	else
		$('#suggestions .empty').show()
		$('#postComment').hide()
		$('#comments .noSuggestion').show()
		$('#comments .empty').hide()

### Load test data. ###
$.getJSON('init.json').done((data) ->
	### Constructs the users (from test data) and adds these to any users made before loading test data. ###
	users = data.users.map((user) ->
		new User(user.name, user.email)
	).concat(users)

	### Constructs the suggestions and comments (from test data). ###
	suggestions = data.suggestions.map((suggestion) ->
		suggestion.author = users[suggestion.author]
		suggestion.date = new Date(suggestion.date)
		suggestion.comments = suggestion.comments.map((comment) ->
			new Comment(comment.text, users[comment.author], new Date(comment.date))
		)
		new Suggestion(suggestion.text, suggestion.score, suggestion.comments, suggestion.shares, suggestion.author, suggestion.date)
	)

	showSuggestions()
)

### Sign in helper function. ###
signIn = (user) ->
	currentUser = user
	$('.navbar-nav').addClass('signedIn')
	showSuggestions()

### Sign in handler. ###
$('#signIn').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	email = $(this).find('#email').val()

	user = users.filter((user) ->
		user.email is email
	)[0]

	if user? then signIn(user) else alert('That username does not exist. Please try a different username.')
)

### Sign up handler. ###
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

### Sign out handler. ###
$('.signOut').click((event) ->
	event.stopPropagation()
	event.preventDefault()
	currentUser = anonymousUser
	$('.navbar-nav').removeClass('signedIn')
	showSuggestions()
)

### View user's suggestions handler. ###
$('.viewSuggestions').click((event) ->
	event.stopPropagation()
	event.preventDefault()
	showSuggestions(currentUser)
)

### Post suggestion handler. ###
$('#postSuggestion').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	text = $(this).find('#text').val()
	suggestion = new Suggestion(text, 0, [], 0, currentUser, new Date())
	suggestions.splice(0, 0, suggestion)
	$(this).find('.cancel').click()
	$('#suggestionsContainer').prepend(suggestion.toHTML(true))
	$('#suggestions .empty').hide()
	$(this).find('#text').val('')
)

### Post comment handler. ###
### Need to reset text area. ###
$('#postComment').submit((event) ->
	event.stopPropagation()
	event.preventDefault()
	text = $(this).find('#text').val()
	comment = new Comment(text, currentUser, new Date())
	currentSuggestion.addComment(comment)
	$('#commentsContainer').prepend(comment.toHTML())
	$(this).find('.cancel').click()
	currentSuggestionElement.find('.reply .number').text(currentSuggestion.comments.length)
	$('#comments .empty').hide()
	$(this).find('#text').val('')
)

### Cancel handler. ###
$('form .cancel').click((event) ->
	event.stopPropagation()
	$(this).parent().children('#text').val("")
)

### Submit handler. ###
$('form .submit').click((event) ->
	event.stopPropagation()
	$(this).submit()
)
