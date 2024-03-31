### V2 (Resolve these):

## Suggestions(User Experience) :
	Google & Facebook Login
	Add relation user.notifications{ id,read:boolean,message }

### Leaving For Later(V3?) :

## Core:
    		Add relation user.chats.users.messages (real time chat?) (Would be better if i build a seperate backend for this..)
			Profile Setup Steps
    		Backend Validations
    		Cache Implementation
    		Multi-Threading
    		polls
    		Have some nlp logic to hide similar content when downvoting a post
    		Have some logic for recommendation

## Consider:

    		ChangeLog for the new update ?
    		mui-tiptap // or create my own simple MUI editor ??
    		Organize Api Calls

## Maybe:

    		Email template : Using html instead of template rn (Vercel build issue)
    		Improve mobile performance?
    		Dark mode (MUI Theme setup completely)
    		Overall Font + Logo-Color and Design ETC

### What we doing right now:
#		Solution:
			Include only ids for user topic/questions/answers?
			Add relation user.notifications{ id,read:boolean,message }
			Google & Facebook Login
				Checkout passport google login
				Setup Strategies
