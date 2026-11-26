# Inhoud van de vijf digitale cadeaus van SPIN THE FUN! (Black Friday 2026).
# Taal: eenvoudig Amerikaans Engels. Geen emdash, geen " - " als scheiding, geen verzonnen cijfers.
# Bouwen: python3 docs/black-friday-2026/maak_cadeaus.py

HOOKS = {
    "slug": "funkiness-10-killer-hooks",
    "kicker": "SPIN THE FUN! prize",
    "titel": "10 Killer Hooks",
    "sub": "Ten opening lines that make people stop scrolling. Swap the words in [brackets] and they are yours.",
    "intro": [
        "The hook is the first line people see. On a video it is the first two seconds, in a post it is the first line of the caption. If the hook doesn't land, nobody sees the rest, no matter how good it is.",
        "How to use these: put the hook on screen as text in the first second of your video AND as the first line of your caption. Then deliver what the hook promised, fast."
    ],
    "items": [
        ("Don't book a [service] on Curaçao until you've seen this.",
         "Dive shop: \"Don't book a dive on Curaçao until you've seen this.\" Then show three things to check before you book, like group size and who your guide is.",
         "It promises to save the viewer from a mistake. Nobody wants to be the person who booked wrong."),
        ("We almost didn't post this.",
         "Restaurant: show the dish that went wrong in the kitchen, and how it turned into this week's special.",
         "It feels like a secret. People stay to find out what you almost kept to yourself."),
        ("The question we get every single week:",
         "Realtor: show the question on screen (\"Can I rent out my apartment when I'm not on the island?\") and answer it in 20 seconds.",
         "If you get the question every week, it is worth answering where everyone can see it."),
        ("[Number] seconds. That's how long it takes to [result].",
         "Hair salon: \"40 seconds. That's how long it takes to fix flat hair before a party.\" Film it, with a timer on screen.",
         "A clear number and a clear result. Viewers stay to see if you make it in time."),
        ("If your [thing] does this, call us.",
         "Airco service: \"If your airco drips like this, call us.\" Show the drip, then the fix.",
         "People instantly check if it's happening to them. That's the moment they need you."),
        ("Nobody talks about this part of [your job].",
         "Vacation rental: \"Nobody talks about this part of hosting.\" Show the full clean between check-out at 11 and check-in at 3.",
         "Behind the scenes makes people trust you. They see the work they normally don't see."),
        ("Rate this from 1 to 10.",
         "Bakery: show the new pastry being cut open in slow motion. Ask for a number in the comments.",
         "Giving a number takes one second, so people actually comment. Comments get your post shown to more people."),
        ("Stop scrolling if you [very specific situation].",
         "Wedding planner: \"Stop scrolling if you're getting married on Curaçao next year.\"",
         "The more specific, the stronger. The right person feels personally called out."),
        ("This is what [amount] gets you at [business].",
         "Lunch spot: show everything that comes with your lunch deal, one item at a time, with the price at the end.",
         "People love to see value with their own eyes. It answers \"is it worth it?\" before they ask."),
        ("POV: you [moment your customer knows well].",
         "Car rental: \"POV: you land at the airport and your car is already waiting.\" Film it from the customer's eyes.",
         "Viewers see themselves in the moment. That's the feeling they want to buy."),
    ],
    "slot": "Tip: write three hooks for every post and pick the one that would make YOU stop. The first idea is rarely the best one."
}

AI_PACK = {
    "slug": "funkiness-ai-power-pack",
    "kicker": "SPIN THE FUN! prize",
    "titel": "AI Power Pack",
    "sub": "Ten prompts you can paste straight into ChatGPT, Claude, Gemini or any similar AI tool.",
    "intro": [
        "How to use: copy a prompt, replace everything in [brackets] with your own details and paste it into the AI tool. The more specific your details, the better the result.",
        "Every prompt has a role at the start (\"Act as a professional ...\") and says what you get back (\"Output: ...\"). The role tells the AI who to be, the output tells it what to hand you. Keep both sentences.",
        "Not happy with the answer? Don't start over. Reply with what you want different, like \"shorter\", \"more fun\" or \"less salesy\". AI gets better on the second and third try."
    ],
    "groepen": [
        ("Social media content", [
            ("Five posts in your voice",
             "Act as a professional social media marketer for [business name], a [type of business] on Curaçao. Our customers are [who they are]. Our tone is [for example: friendly and a bit funny]. Write 5 Instagram posts for next week. For each post give: a hook of max 10 words, a caption of max 80 words in simple English, and one clear next step for the reader. Don't use cliches or the word 'elevate'. Output: a list of 5 posts, each with the labels Hook, Caption and Next step.",
             "Paste one or two of your best captions under the prompt so the AI copies your style."),
            ("Turn one thing into a week of content",
             "Act as a professional social media content creator for [business name]. Here is something that happened this week: [describe it in a few sentences]. Turn this into: 1 short video idea with a hook, 1 carousel of 5 slides (text per slide), 1 story with a poll question and 1 Facebook post. Keep everything simple and real, no sales talk. Output: four labeled parts: Video idea, Carousel, Story and Facebook post.",
             "Works best with real moments: a happy customer, a new product, a funny mistake."),
            ("Reel script in 20 seconds",
             "Act as a professional short-video scriptwriter for [business name]. Write a script for a 20-second video about [topic]. Split it into: first 2 seconds (hook on screen), middle (what we show, scene by scene), last 3 seconds (call to action). Add what to film for each scene with only a phone. Make the hook something that makes people stop scrolling. Output: a scene list where each scene has the time, what people see on screen and what we film.",
             "Ask for three different hooks and pick the strongest."),
        ]),
        ("Marketing ideas", [
            ("Ten ideas from your customers' questions",
             "Act as a professional content strategist for [business name]. These are questions our customers often ask: [list 3 to 5 questions]. For each question, give 2 content ideas that answer it in a fun way. Mention which format fits best (video, carousel, story or post) and why. Output: a list per question, with the question as a heading and the 2 ideas below it.",
             "Your customers' questions are the best content plan you'll ever get. And it's free."),
            ("A small campaign for a slow month",
             "Act as a professional marketing consultant for small businesses on Curaçao. [Business name] is a [type of business] on Curaçao. [Month] is usually a slow month for us. Give me 3 small campaign ideas we can run with a small budget, that fit our customers [who they are]. For each idea: the idea in one sentence, why it would work, what we need, and how we know if it worked. Output: 3 ideas, each with the labels Idea, Why it works, What we need and How we measure it.",
             "Ask the AI to make each idea 'more surprising' if the first ideas feel too safe."),
        ]),
        ("Better texts", [
            ("Make it shorter and stronger",
             "Act as a professional editor. Make this text shorter and stronger. Keep the meaning, cut everything that doesn't help the reader. Use simple English and short sentences. Give me two versions: one half as long, one in max 3 sentences. Output: Version 1 and Version 2, nothing else. Text: [paste your text]",
             "Great for website text, flyers and long captions."),
            ("From 'about us' to 'about you'",
             "Act as a professional copywriter who writes for the customer, not for the company. Rewrite this text so it talks about what the customer gets, not about us. Replace 'we offer' and 'we are' sentences with what the reader gets or feels. Keep the facts. Output: the new text only, followed by one line that says what you changed the most. Text: [paste your text]",
             "Read both versions out loud. You'll hear the difference right away."),
            ("Your bio in one line",
             "Act as a professional social media copywriter. Write 5 options for an Instagram bio for [business name]. Each must say in max 150 characters: what we do, for whom, where (Curaçao) and one reason to message us. Make it sound like a person, not a company. Output: a numbered list of 5 bios, each with its character count.",
             "Pick one and test it for two weeks. Then try another."),
        ]),
        ("Customer communication", [
            ("Answer a review like a pro",
             "Act as a professional, friendly customer care manager for [business name]. Write a reply to this review. Thank the person by name, mention one specific thing from their review, keep it under 60 words and sound warm and human. If the review is negative: stay calm, don't argue, offer to fix it via [WhatsApp or email]. Output: only the reply, ready to post. Review: [paste the review]",
             "Others read your replies too. A good reply to a bad review can win you new customers."),
            ("WhatsApp replies that sell without pushing",
             "Act as a professional, friendly customer service agent for [business name]. Customers often send us this question on WhatsApp: [question]. Write 3 short reply options (max 50 words each) that answer the question, sound friendly and end with an easy next step, like booking a time or sending a photo. Output: a numbered list of 3 replies, each with its word count. Tone: [your tone].",
             "Save the best one as a quick reply in WhatsApp Business so you never have to type it again."),
        ]),
    ],
    "slot": "Golden rule: AI writes the first version, you make it yours. Always read it once more and add one detail only you know."
}

RESCUE = {
    "slug": "funkiness-content-rescue-kit",
    "kicker": "SPIN THE FUN! prize",
    "titel": "Content Rescue Kit",
    "sub": "Five things that quietly hold your posts back, how to fix each one and a checklist for every post you make.",
    "intro": [
        "You have heard it all: post more, use good light, be consistent. This kit is different. Each of these ten ideas starts with a blind spot, something you can't see because you are too close to your own business. Every idea takes minutes and costs nothing."
    ],
    "test": ("The 3-second test", "Before you fix anything, do this. Hand your phone to someone who doesn't know your business. Show your latest post for 3 seconds. Then ask two things: What is this? What would you do next? If they can't answer both, the post needs rescuing. Now you know where to start."),
    "problemen": [
        ("You can't see your own place anymore",
         "You have seen your place a thousand times, so it feels ordinary. To a first-time visitor it is the most interesting thing you have.",
         "Hand your phone to a first-time customer (ask permission first) and let them film what surprises them. Post it with their reaction.",
         "Next first-time customer: \"Could you film the thing you like most here? Ten seconds is enough.\"",
         "A photo of your counter, taken by you for the hundredth time.",
         "A 10-second clip of a new customer showing the thing that surprised them."),
        ("You film the product, not the moment of the reveal",
         "The product is not the story. The face of the customer at the moment they see the result is.",
         "Film the reveal (ask permission): the mirror, the keys, the first bite, the finished kitchen. Start filming 5 seconds before, and film the face first, then the result.",
         "Think of your reveal moment. Next time it happens, ask: \"Can I film your reaction?\"",
         "A photo of the finished haircut, from behind.",
         "The 5 seconds when she sees herself in the mirror."),
        ("You never say who it is NOT for",
         "\"Great for everyone\" speaks to nobody. When you say who it is not for, the right people think: that's me.",
         "Write one post that starts with \"Not for you if...\" and ends with who it is for.",
         "Finish this in your notes app and post it today: \"Not for you if ___. For you if ___.\"",
         "\"We have something for everyone!\"",
         "\"Not for you if you want the cheapest. For you if you want it done right the first time.\""),
        ("Your slow hour is invisible",
         "Customers can't book what they can't see. Your empty hour looks exactly like a full one.",
         "Post today's open spots, today, at the slow hour. Real, small and specific.",
         "Open your agenda. Find the two emptiest hours today. Post them with one word to reply.",
         "\"Book your appointment now!\"",
         "\"[2] spots open at [3 PM] today. Send 'IN' on WhatsApp.\""),
        ("You post and hope",
         "Posting is a gamble. Your regulars are free, friendly testers who answer within minutes.",
         "Send two versions of your first line to five regulars on WhatsApp: \"A or B, which would you open?\" Post the winner.",
         "Write two first lines for your next post. Send them to five regulars now.",
         "You post the one you like and hope.",
         "\"A or B?\" to five regulars. The winner goes live."),
        ("Your best answers live in WhatsApp, not on your profile",
         "Every question a customer asks has been asked by others too. You already wrote the answer, it is true and it is in your phone.",
         "Screenshot the question (hide the name) and answer it in a 20-second video, with the question on screen.",
         "Scroll your WhatsApp. Pick the question you answered most. Film the answer in one take.",
         "An opening-hours post and a link in your bio.",
         "The question you got three times this week, answered in 20 seconds."),
        ("You show the result, never the work",
         "The effort behind the result is the part customers never see, and the part nobody can copy.",
         "Post \"what you don't see\": the first thing you do before customers arrive. Film it in the order it happens, without talking.",
         "Tomorrow, film 15 seconds of the first thing you do before opening.",
         "\"Our fresh bread is ready!\"",
         "\"5:40 AM. The oven, the first tray, the first one that doesn't make it.\""),
        ("Your regulars have names, your offers don't",
         "People repeat what is easy to say. \"The usual\" is already a brand. Give it a name and they will order it, say it and tag it.",
         "Name your most-ordered combo after a customer (ask permission), a place or a moment. Put the name on the menu and in your posts.",
         "Pick the combo people order most. Give it a name. Tell the customer it is named after them.",
         "\"Lunch deal 2.\"",
         "\"The [Friday Fixer]: what [name] orders every Friday. Order it by name.\""),
        ("Customers can't find the door",
         "A customer who struggles to find you arrives annoyed, or does not arrive at all. An address in your bio does not help on the last stretch.",
         "Film the way: from the nearest landmark to your door, 15 seconds, slow, no talking. Pin it to your profile.",
         "Walk from the nearest landmark to your door with your phone filming. Pin the clip today.",
         "Your address in your bio.",
         "A 15-second walk from [landmark] to your door, pinned at the top."),
        ("You write your hooks from your own head",
         "You know your business too well to know what is surprising about it. Your customers know it.",
         "Ask five customers: \"What did you not expect when you first came to us?\" Their answer is your hook, in their words.",
         "Send that one question to five customers on WhatsApp today.",
         "Hook: \"Quality service you can trust.\"",
         "Hook: \"I didn't expect them to remember my name.\" A customer."),
    ],
    "checklist": [
        "A first-time customer filmed my place.",
        "I filmed a customer's reaction at the moment of the reveal.",
        "I posted a \"Not for you if...\" post.",
        "I posted today's open spots.",
        "I asked five regulars \"A or B?\" before posting.",
        "I answered a WhatsApp question in a video.",
        "I filmed what happens before customers arrive.",
        "I gave my most-ordered offer a name.",
        "I pinned a clip of the way to my door.",
        "I asked five customers what they did not expect.",
    ],
    "stappen": ("Rescue your old posts in 15 minutes", [
        "Pick your three best posts from last year.",
        "Ask five customers on WhatsApp: \"What did you not expect when you first came to us?\"",
        "Rewrite only the first line of each post, using the best answer.",
        "Post them again on three different days.",
        "After a week, look at which first line got the most reactions. Write more like that one.",
    ]),
    "slot": "New followers have never seen your old posts. Rescue them, post them again and see which one wins."
}

IDEAS = {
    "slug": "funkiness-30-days-of-ideas",
    "kicker": "SPIN THE FUN! prize",
    "titel": "30 Days of Ideas",
    "sub": "A month of content ideas for Instagram, Facebook and TikTok. Mix of useful, selling and personal.",
    "intro": [
        "No need to post every day. Start with the idea that makes you smile and spread the rest over the month. Every idea works as a short video, a photo post or a story. These are the ideas that the usual lists skip, so your posts won't look like everyone else's.",
        "Legend: USEFUL helps your customer, SELL shows what you offer, PERSONAL shows the people behind the business."
    ],
    "dagen": [
        ("USEFUL", "What we'd tell our own family", "Film the honest advice you would give a family member before they buy. Include one thing they should not buy.", "Car rental: \"The upgrade you don't need, and the one you do.\""),
        ("PERSONAL", "Why it's called that", "Tell the story behind your business name in 20 seconds. Add the name that lost.", "Any business: who came up with the name, and what it almost was."),
        ("SELL", "Guess the price", "Show the product without the price. Ask for guesses in the comments. Reveal the price in a story the next day.", "Gift shop: the hand-painted bowl, three guesses."),
        ("USEFUL", "The question behind the question", "Customers ask one thing and mean another. Answer the real question.", "Realtor: \"How much is it?\" really means \"Is it worth it?\" Answer that one."),
        ("PERSONAL", "The object with a story", "Film one thing in your place that has a story: the dent, the old tool, the chair nobody replaces.", "Workshop: the hammer that is older than the business."),
        ("SELL", "Gone by [time]", "When something sells out, post the moment. Add a way to reserve the next batch.", "Bakery: \"Gone by 9:40. Reserve tomorrow's on WhatsApp.\""),
        ("USEFUL", "Fix it yourself, then call us", "Show the small problem your customer can solve alone. Say when it is time to call you.", "Aircon service: the filter you can clean in two minutes."),
        ("PERSONAL", "Thank the person nobody sees", "Thank someone behind the scenes: the supplier, the cleaner, the driver. Ask permission first.", "Restaurant: the person who delivers the fish at 6 AM."),
        ("SELL", "The honest downside", "Name one downside of what you sell and how to deal with it. It makes everything else you say easier to believe.", "Plant shop: \"This plant hates air conditioning. Here's where it is happy.\""),
        ("USEFUL", "Which one is right for you? Three questions", "Three yes-or-no questions that lead to one pick. Post the answer in a story.", "Gym: group class or personal trainer?"),
        ("PERSONAL", "The first message we ever got", "Show your first customer message or review (blur the name). Say what it meant to you.", "Any business: \"Hi, are you open on Sunday?\""),
        ("SELL", "Good, better, best: who is it for?", "Explain your three options in plain words, with who each one is for.", "Car wash: quick, full, deep. Which car owner picks which?"),
        ("USEFUL", "Send us these three things", "Tell people the three details that let you answer in five minutes. Post it as a card they can screenshot.", "Realtor: budget, area, move date."),
        ("PERSONAL", "Our unofficial jobs", "Everyone in the team has a job that isn't in their contract. Show them.", "Any team: \"Head of snacks.\" \"Keeper of the good pen.\""),
        ("SELL", "A real job, line by line", "Take one finished job and explain what each line of the price is for (hide the customer's name).", "Painter: the quote for one room, explained line by line."),
        ("USEFUL", "What we say, what you hear", "Take a word you use every day and say what your customer hears.", "Any business: \"Lead time\" sounds fast. It means how long you wait."),
        ("PERSONAL", "What we'd be doing if not this", "Every team member says what their other life would be.", "Salon: the stylist who would be a fisherman."),
        ("SELL", "\"I almost didn't...\"", "Ask a customer what almost stopped them. Answer that worry in a post.", "Dentist: \"I almost didn't call because...\""),
        ("USEFUL", "The one-minute check at home", "Give a one-minute test customers can do to find out if they need you.", "Home services: turn off all taps and check if the water meter still moves."),
        ("PERSONAL", "A day in the life of the thing you sell", "Tell one day from the point of view of your product.", "Car rental: one car, one day, [three] drivers, one sunset."),
        ("SELL", "Shop for a person, not a product", "Pick a type of person and show three things for them.", "Gift shop: \"For the friend who has everything.\""),
        ("USEFUL", "A regular's secret", "Ask a regular how they really use what you sell. Post their tip, with their name.", "Coffee spot: the regular's secret order."),
        ("PERSONAL", "The great debate", "Pick a harmless debate in your field and ask followers to pick a side.", "Dive shop: fins on first or mask first?"),
        ("SELL", "The one thing we won't sell you", "Say one thing you won't do or sell, and why. It shows what you stand for.", "Salon: \"We won't [thing]. Here's why.\""),
        ("USEFUL", "Recommend a neighbor", "Recommend a business near you that is not a competitor and tag them. They can share it with their own followers.", "Beach bar: the dive shop two doors down."),
        ("PERSONAL", "The mistake that taught us most", "Tell one real mistake, what it cost and what you changed.", "Any business: the order we got wrong, and the checklist that came from it."),
        ("SELL", "Give away one small piece", "Give away a small piece of what you sell: a mini lesson, a tip, a sample. Free, no catch.", "Gym: a three-minute warm-up anyone can do at their desk."),
        ("USEFUL", "The expensive mistake", "Tell customers the one mistake that costs money in your field and how to avoid it.", "Car rental: what to photograph before you drive off."),
        ("PERSONAL", "What customers say that makes us smile", "Share the funniest or sweetest thing a customer said this month. No names.", "Any business: \"Do you have the one from yesterday?\""),
        ("SELL", "Next month, you choose", "Show what could come next month and let people vote on what goes first.", "Any business: three options, one story poll, the winner goes live."),
    ],
    "slot": "Save this list and tick off what you posted. At the end of the month, check which three posts did best and make more of those."
}

FIX = {
    "slug": "funkiness-5-minute-marketing-fix",
    "kicker": "Mystery FUNky Gift",
    "titel": "The 5-Minute Marketing Fix",
    "sub": "Ten 30-second checks that look at your profile through your customer's eyes, plus three on Google.",
    "intro": [
        "Your profile is a shop window you never see the way a customer sees it. These ten checks look at it from the customer's side. Set a timer: 30 seconds each, five minutes in total."
    ],
    "acties": [
        ("30 seconds", "Write your first line in your customer's words",
         "Open WhatsApp and read the last three messages customers sent you. Copy the words they use for what they want. Use one of those words in the first line of your bio.",
         "You write \"culinary experience\". Customers write \"lunch near the harbor\". Use theirs."),
        ("30 seconds", "Let Google write your keywords",
         "Type what you do plus Curaçao in the Google search bar, but don't press enter. The suggestions that appear are things people really search for. Pick one and use those exact words in your bio and your Google profile.",
         "You type \"nail salon Curaçao\". Google suggests a few endings. Use the ones that fit you."),
        ("30 seconds", "The wrong-customer filter",
         "Look at your last ten messages from customers. Count how many are the customer you really want. If it is fewer than half, your profile is attracting the wrong people. Change the first line to speak to the right ones.",
         "\"For busy parents who want dinner sorted by 6 PM.\" instead of \"Great food for everyone.\""),
        ("30 seconds", "Be your own mystery customer",
         "Send your business a WhatsApp from a friend's phone: \"Hi, do you have time this week?\" See how long the answer takes and how it feels. Then set a greeting message in WhatsApp Business that asks the one thing you always ask first.",
         "Greeting: \"Hi! Thanks for your message. To answer fast: which day, and how many people?\""),
        ("30 seconds", "Borrow a customer's sentence",
         "Ask a happy customer: \"What would you tell a friend about us?\" Ask permission to use the answer. Put their exact sentence in your bio or in a pinned post.",
         "\"They remembered my name on the second visit.\" A customer."),
        ("30 seconds", "Name your highlights after the questions",
         "Rename your story highlights after the questions customers send you, instead of \"Menu\" or \"Reviews\". The answer is one tap away.",
         "\"Prices?\" \"Where are you?\" \"How do I book?\""),
        ("30 seconds", "Say your @name out loud",
         "Say your username to a friend and ask them to type it. Every wrong letter is a customer who doesn't find you. If they get it wrong, make it easier to type, or put the simple version in your name field.",
         "\"[bakery_cw_official_2]\" becomes a name a person can type after hearing it once."),
        ("30 seconds", "Ask an AI about your business",
         "Open ChatGPT, Gemini or Claude and ask: \"What can you tell me about [your business name] on Curaçao?\" and \"Where can I find [what you do] on Curaçao?\" If it knows nothing or gets it wrong, your online information is thin or different in different places.",
         "Write down what it says wrong. That is your list of what to fix first."),
        ("30 seconds", "Pin the post that says who it is for",
         "Pin one post that answers \"is this for me?\": who you are for, and who you are not for.",
         "\"For [who you are for]. Not for [who you are not for].\""),
        ("30 seconds", "Make every place say the same thing",
         "Search your own business name. Compare the name, phone number and opening hours on Google, Facebook, Instagram and your website. Fix the first difference you find.",
         "Old hours on Facebook, new hours on Google: that is how a customer arrives at a closed door."),
    ],
    "prompt": ("Bonus prompt: your new bio",
               "Act as a professional social media copywriter. Write 5 versions of an Instagram bio for [business name], a [type of business] on Curaçao. Use the words from these real customer messages: [paste 3 messages]. Each version: max 150 characters, first line says what we do and where, second line gives one reason to choose us, last line tells people what to do next (for example: \"WhatsApp us to book\"). Simple English, friendly, no cliches. Output: a numbered list of 5 bios, each with its character count."),
    "slot": "Done? Do this check again every three months. Things change, your profile should too."
}

ALLE = [HOOKS, AI_PACK, RESCUE, IDEAS, FIX]


# ---------------------------------------------------------------------------
# Toevoeging 25-11-2026: elk cadeau werkt voor alle branches op Curaçao.
# Twaalf branches: hotels en resorts, restaurants en bars, vakantieverhuur, makelaars,
# tours en duiken, winkels, beauty en wellness, sport en gezondheid, autoverhuur en garages,
# huis en klusbedrijven, zorg, en zakelijke dienstverlening (boekhouding, juridisch, verzekering, bank).
# ---------------------------------------------------------------------------
HOOKS['sub'] = "Ten opening lines that make people stop scrolling, plus a ready-to-use hook for 12 kinds of businesses on Curaçao. Swap the words in [brackets] and they are yours."
HOOKS['branches'] = ("Your branch, ready to use", "One hook per branch, filled in. Copy it, film the idea next to it and post.", [
    ("Hotels and resorts", "Nobody tells you this before you book a hotel on Curaçao.", "Film the room, the view and the three things that are included, in that order."),
    ("Restaurants and bars", "POV: you sit down and the first plate is already on its way.", "Film from the guest's seat: the table, the plate arriving, the first bite."),
    ("Vacation rentals", "Read this before you book a place on Curaçao.", "Show three things guests should check in any rental, then show them in yours."),
    ("Real estate", "Stop scrolling if you want to buy on Curaçao and don't know where to start.", "Say the first three steps on camera, one sentence each."),
    ("Tours, diving and water sports", "POV: you wake up and today's plan is a boat.", "Film the morning from the guest's eyes: the pier, the boat, the first splash."),
    ("Shops and retail", "Three things we would buy first in this shop.", "Pick up each item, say in one sentence why, and show the price tag."),
    ("Beauty and wellness", "[Number] minutes. That's all it takes to [result].", "Film the treatment sped up with a timer on screen, then the result."),
    ("Sports and health", "Try this at your desk. It takes 30 seconds.", "Show one simple move, slowly, from the front. Add where to find you for more."),
    ("Car rental and garages", "If your car makes this sound, don't wait.", "Record the sound, then show what you check first and how fast you can help."),
    ("Home services (construction, airco, pool, cleaning)", "Before and after: the job we finished this week.", "Same angle before and after. Add one line on how long it took."),
    ("Healthcare (doctor, dentist, physio)", "The question every patient asks us.", "Put the question on screen and answer it in plain words in 20 seconds."),
    ("Professional services (accounting, legal, insurance, banking)", "Three things to bring before you meet us.", "Hold up each item or show it on screen. Then say how to book the first meeting."),
])
HOOKS['slot'] = "Your branch is not in the list? Use hooks 1 to 10 and write three versions for every post. Pick the one that would make YOU stop."

AI_PACK['sub'] = "Ten prompts you can paste straight into ChatGPT, Claude, Gemini or any similar AI tool, plus fill-in examples for 12 kinds of businesses on Curaçao."
AI_PACK['branches'] = ("Fill-in examples for your branch", "Copy the words that fit you into the [brackets] of any prompt above.", [
    ("Hotel or resort", "hotel", "couples and families planning a holiday on the island"),
    ("Restaurant or bar", "restaurant", "locals and tourists looking for a place to eat tonight"),
    ("Vacation rental host", "vacation rental", "guests booking through Airbnb or directly"),
    ("Real estate agent", "real estate agency", "people who want to buy, sell or rent on the island"),
    ("Tours and diving", "dive shop", "visitors and residents who want to be out on the water"),
    ("Shop or retail", "shop", "customers who walk in and customers who order by WhatsApp"),
    ("Beauty and wellness", "hair and beauty salon", "regular clients and people who just moved here"),
    ("Gym, sports and health", "gym", "people who want to start training or get back to it"),
    ("Car rental or garage", "car rental company", "visitors who need a car and residents who need a quick fix"),
    ("Home services", "airco and pool service company", "homeowners and property managers"),
    ("Healthcare", "dental clinic", "families and individuals who want clear answers before booking"),
    ("Professional services", "accounting firm", "business owners who want one clear person to ask"),
])

RESCUE['branches'] = ("The same ideas in your branch", "Pick your line, fill in the [brackets] and post it.", [
    ("Hotels and resorts", "\"We are proud to offer comfortable rooms with great amenities.\"", "A first-time guest films their first 10 seconds in the room. No edit. \"I didn't expect [what they said].\""),
    ("Restaurants and bars", "\"New menu available now.\"", "\"The [Friday Fixer]: what [name] orders every Friday. Order it by name.\""),
    ("Real estate", "\"Beautiful apartment for sale, call for details.\"", "The 15-second walk from [landmark] to the front door, then the balcony. \"Send 'VIEW' on WhatsApp.\""),
    ("Home services", "\"We offer all kinds of repair and maintenance services.\"", "\"[7:30 AM]. The first job of the day, filmed in order, no talking. This is what you don't see before we ring your bell.\""),
    ("Healthcare", "\"We provide quality dental care for the whole family.\"", "\"Not for you if [what you don't do]. For you if [what you do].\""),
    ("Professional services", "\"Our firm offers comprehensive solutions for your business.\"", "\"The question three clients asked us this week, answered in 20 seconds, with the question on screen.\""),
])
RESCUE['sub'] = "Ten blind spots that quietly hold your posts back, an unusual idea to fix each one, a tracker and the same ideas for six kinds of businesses."

IDEAS['sub'] = "A month of content ideas for Instagram, Facebook and TikTok that you won't find in the usual lists. Mix of useful, selling and personal. With swaps for services, B2B and professionals."
IDEAS['extra'] = ("No shop window? Swap in these", "For accountants, lawyers, insurers, banks, clinics, contractors and any business that sells expertise or does the work at the customer's place. Replace any day above with one of these.", [
    ("The problem a client didn't know they had", "Tell about something you found in the first meeting that the client had not seen. No names."),
    ("The first ten minutes", "Show what you ask first and why, so a new client knows what to expect."),
    ("The three answers that change the quote", "Name the three things that make a price go up or down."),
    ("The sentence clients say before they hire us", "Share the sentence you hear right before someone says yes, and answer it."),
    ("The thing we check that you can't see", "Show the check you do that no client ever sees, and what it prevents."),
    ("What happens if you wait a year", "Show with one real example what waiting costs. No scare tactics, only the plain story."),
    ("The question we wish clients asked first", "Say the question, then answer it."),
    ("The confusing letter, translated", "Take a typical official letter or form (no names) and say what it really means, line by line."),
])

FIX['sub'] = "Ten 30-second checks that look at your profile through your customer's eyes, plus three on Google."
FIX['google'] = ("Three more on Google", "Open your Google Business Profile (the box that shows when someone searches your business name) and check:", [
    "Describe each of your services in one plain sentence, in the words customers use.",
    "Add a photo of your entrance, taken from the street. It is the photo people need when they arrive.",
    "Call your own listed number from another phone. What does a caller hear?",
])
