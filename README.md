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
			Don't send upvotedBy,downvotedBy in the frontend (will be compuation heavy this way for the frontend).
			Send api calls to get current vote state (which checks both upvoted and downvoted if the user has voted and gives the response in the form of true/false/null)
			Api call will be in user/get-vote-status (There can be like thousands of questions but most likely less in upvoted/downvoted for a single user)
			Add edge case to senarios to prevent double upvoting/downvoting
			When clicked on score gives 10 users who have upvoted this (maybe a tab for downvoted aswell)
			Change upvoted by to include only id's so its easier to record and pass around
			Change frontend Icons shit to checkbox
