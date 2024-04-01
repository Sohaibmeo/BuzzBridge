## What we doing right now:

# V3 Things in priority:
			Profile Setup Steps
				An invisible field called firstLogin and with it we display these steps to implement the profile setup?
				
    		polls (Additionally change Questions to Posts and Answers to Comments)
			
			Dark mode (MUI Theme setup completely)

			mui-tiptap // or create my own simple MUI editor ?? 
				Basically change the look for adding description etc
				Maybe change the question to be on the main page?

			Google & Facebook Login
				Checkout passport google login
				Setup Strategies
					
			Add relation user.notifications{ id,read:boolean,message }:
				User performs an action (that will generate notifiction)
					Create Question
					Create Topic
					New posts in followed Topics
					5 upvote, 50 upvote, 100 upvote, 1000 upvote
				Based on when the certain conditions are met we :
					Generate a format :
					type {new} in followed {topicId} if previos status = {status} display: {notification message}
					type {new} in topicsCreated/questionCreated {userId} status {:unRead} display: {notification message}
					type {new} in YourPost {postId} status {:unread} display: {notification message}
					Other condition to send notification...

# Whenever you feel like touching this :
    		Organize Api Calls
				Make a different folder for this in the frontend call it api/v1/

### Leaving For Later(V4?) :
    		Cache Implementation
				Frontend Backend Db Backend Frontend
				Frontend Backend(Cache) Frontend
    		Have some logic for recommendation + hide disliked content
				For this every post needs to have certain tags

	