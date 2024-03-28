### Starting V2 Implementation:
## Feature (Goals) : 
#	Suggestions and Feedback(Highest Priority):
		Lazy Loading (Image and meanwhile implement loading skeleton for the whole card?)
		Remove validations for question title k (Just make it a post instead ? and make the other thing comment)?
		On scroll down add an icon that brings you to the top?
		Videos? (Also change the font that Upload something (Not particularly image...))
#	To be implemented (High Priority):
		Search Bar (Postgres full-text search?)
		Google Login
		Backend Validations
		Cache Implementation
		ChangeLog for the new update ?

###	Leaving For V3? :
##		Core:
			Multi-Threading
			polls
			Have some nlp logic to hide similar content when downvoting a post
			Have some logic for recommendation
##		Consider:
			Profile Setup Steps
			mui-tiptap // or create my own simple MUI editor ??
			Organize Api Calss
##		Maybe:
			Email template : Using html instead of template rn (Vercel build issue)
			Improve mobile performance?
			Dark mode?
			Overall Font + Logo-Color and Design ETC
			Replace account settings button and form with MUI accordion
			Add relation user.notifications{ id,read:boolean,message }

#	Seperate Project :
			Add relation user.chats.users.messages (real time chat?)
			//Register above them with the same data from this site/Something


### Developing :
##    LazyLoading (Routes):
#		Install Imagekit package?
#		For Skeleton loading from actual api calls:
			So loading is sent as a prop with page (Cards have their own page aswell)
			When executing a query .map will rerender each child components
	