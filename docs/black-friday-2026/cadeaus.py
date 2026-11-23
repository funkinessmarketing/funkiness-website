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
         "If you get the question every week, many people who never asked have it too."),
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
        "Not happy with the answer? Don't start over. Reply with what you want different, like \"shorter\", \"more fun\" or \"less salesy\". AI gets better on the second and third try."
    ],
    "groepen": [
        ("Social media content", [
            ("Five posts in your voice",
             "You are a social media marketer for [business name], a [type of business] on Curaçao. Our customers are [who they are]. Our tone is [for example: friendly and a bit funny]. Write 5 Instagram posts for next week. For each post give: a hook of max 10 words, a caption of max 80 words in simple English, and one clear next step for the reader. Don't use cliches or the word 'elevate'.",
             "Paste one or two of your best captions under the prompt so the AI copies your style."),
            ("Turn one thing into a week of content",
             "Here is something that happened at [business name] this week: [describe it in a few sentences]. Turn this into: 1 short video idea with a hook, 1 carousel of 5 slides (text per slide), 1 story with a poll question and 1 Facebook post. Keep everything simple and real, no sales talk.",
             "Works best with real moments: a happy customer, a new product, a funny mistake."),
            ("Reel script in 20 seconds",
             "Write a script for a 20-second video for [business name] about [topic]. Split it into: first 2 seconds (hook on screen), middle (what we show, scene by scene), last 3 seconds (call to action). Add what to film for each scene with only a phone. Make the hook something that makes people stop scrolling.",
             "Ask for three different hooks and pick the strongest."),
        ]),
        ("Marketing ideas", [
            ("Ten ideas from your customers' questions",
             "These are questions our customers often ask: [list 3 to 5 questions]. For each question, give 2 content ideas that answer it in a fun way. Mention which format fits best (video, carousel, story or post) and why.",
             "Your customers' questions are the best content plan you'll ever get. And it's free."),
            ("A small campaign for a slow month",
             "[Business name] is a [type of business] on Curaçao. [Month] is usually a slow month for us. Give me 3 small campaign ideas we can run with a small budget, that fit our customers [who they are]. For each idea: the idea in one sentence, why it would work, what we need, and how we know if it worked.",
             "Ask the AI to make each idea 'more surprising' if the first ideas feel too safe."),
        ]),
        ("Better texts", [
            ("Make it shorter and stronger",
             "Make this text shorter and stronger. Keep the meaning, cut everything that doesn't help the reader. Use simple English and short sentences. Give me two versions: one half as long, one in max 3 sentences. Text: [paste your text]",
             "Great for website text, flyers and long captions."),
            ("From 'about us' to 'about you'",
             "Rewrite this text so it talks about what the customer gets, not about us. Replace 'we offer' and 'we are' sentences with what the reader gets or feels. Keep the facts. Text: [paste your text]",
             "Read both versions out loud. You'll hear the difference right away."),
            ("Your bio in one line",
             "Write 5 options for an Instagram bio for [business name]. Each must say in max 150 characters: what we do, for whom, where (Curaçao) and one reason to message us. Make it sound like a person, not a company.",
             "Pick one and test it for two weeks. Then try another."),
        ]),
        ("Customer communication", [
            ("Answer a review like a pro",
             "Write a reply to this review for [business name]. Thank the person by name, mention one specific thing from their review, keep it under 60 words and sound warm and human. If the review is negative: stay calm, don't argue, offer to fix it via [WhatsApp or email]. Review: [paste the review]",
             "Others read your replies too. A good reply to a bad review can win you new customers."),
            ("WhatsApp replies that sell without pushing",
             "Customers often send us this question on WhatsApp: [question]. Write 3 short reply options (max 50 words each) that answer the question, sound friendly and end with an easy next step, like booking a time or sending a photo. Tone: [your tone].",
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
        "Good content isn't about posting more. It's about posts that make people stop, feel something and do something. These five fixes work for any business and cost nothing but a few minutes."
    ],
    "problemen": [
        ("The post is about you, not about them",
         "Start with what the customer wants, worries about or asks. Then show how you help.",
         "We are proud to announce our new menu with fresh local ingredients.",
         "Can't decide what to eat tonight? Here are the 3 dishes our regulars order again and again."),
        ("The best part comes last",
         "Flip it. Put the most surprising, funny or useful moment in the first two seconds or the first line.",
         "Video starts with the logo, then the shop, then (finally) the result.",
         "Video starts with the result, then shows how you got there."),
        ("Too much text on the image",
         "One short sentence on the image. Everything else goes in the caption.",
         "A flyer-style image with prices, opening hours, address and three offers.",
         "One line on the image: \"Fresh pastechi until 10 AM.\" Details in the caption."),
        ("No clear next step",
         "Tell people exactly one thing to do, and make it easy.",
         "\"For more info, check out our website or contact us.\"",
         "\"Send 'TABLE' on WhatsApp and we'll save you a spot for Friday.\""),
        ("It looks like everyone else",
         "Show your real place, your real people and your real customers. Phone footage is fine. Stock photos are not.",
         "A stock photo of a smiling team in an office that could be anywhere.",
         "A 10-second video of your team setting up in the morning, with the real view from your door."),
    ],
    "checklist": [
        "Does the first line or first second make someone stop?",
        "Is it about what the customer gets, wants or asks?",
        "Is there only one short sentence on the image?",
        "Can you see it's really us, really here?",
        "Is there one clear next step, and is it easy?",
        "Would I stop for this if it wasn't my own business?",
        "Did I read it once out loud?",
        "Did I answer the first comments within the hour?",
    ],
    "slot": "Rescue your old posts too: pick your three best posts from last year, fix them with this kit and post them again. Most of your followers never saw them."
}

IDEAS = {
    "slug": "funkiness-30-days-of-ideas",
    "kicker": "SPIN THE FUN! prize",
    "titel": "30 Days of Ideas",
    "sub": "A month of content ideas for Instagram, Facebook and TikTok. Mix of useful, selling and personal.",
    "intro": [
        "No need to post every day. Pick the ideas that fit you and spread them over the month. Every idea works as a short video, a photo post or a story.",
        "Legend: USEFUL helps your customer, SELL shows what you offer, PERSONAL shows the people behind the business."
    ],
    "dagen": [
        ("USEFUL", "The question you hear most", "Answer it in 20 seconds.", "Gym: \"Do I need to train every day to see results?\""),
        ("PERSONAL", "Morning routine", "Show how your day starts, from the first coffee to opening the door.", "Beach bar: chairs out, music on, first customer."),
        ("SELL", "Best seller up close", "Show your most popular product or service in detail and say why people love it.", "Bakery: the pastry that sells out first."),
        ("USEFUL", "Three mistakes to avoid", "Three things customers often get wrong, and what to do instead.", "Car rental: what to check before driving off."),
        ("PERSONAL", "Meet the team", "One team member, three quick questions.", "Salon: \"Favorite style to do? Best tip? Favorite spot on the island?\""),
        ("SELL", "Before and after", "Show the difference you make.", "Cleaning service: the same kitchen, before and after."),
        ("USEFUL", "Myth or fact", "Pick a common belief in your field and say if it's true.", "Dentist: \"Brushing harder cleans better. Myth.\""),
        ("PERSONAL", "Where it all started", "Tell how your business began in 30 seconds.", "Any business: the first day, the first customer."),
        ("SELL", "What [amount] gets you", "Show exactly what your customer gets for one price.", "Lunch spot: the full lunch deal, item by item."),
        ("USEFUL", "Quick how-to", "One small thing your customer can do today.", "Plant shop: how to know when your plant needs water."),
        ("PERSONAL", "A day in fast motion", "Film your whole day in short clips and speed it up.", "Tour company: from loading the bus to sunset."),
        ("SELL", "Customer review, out loud", "Read a real review on camera, or let the customer say it.", "Restaurant: a guest says what they ordered and why they came back."),
        ("USEFUL", "Behind the price", "Explain what goes into what you make or do.", "Jeweler: the hours behind one ring."),
        ("PERSONAL", "Your favorite local spot", "Share a place on the island you love and why.", "Any business: where the team goes after work."),
        ("SELL", "This or that", "Two options, let people vote in the comments or a story poll.", "Ice cream shop: mango or coconut?"),
        ("USEFUL", "Checklist", "A short checklist your customer can save.", "Realtor: five things to check when viewing an apartment."),
        ("PERSONAL", "Bloopers", "The things that went wrong this week.", "Any business: the dropped tray, the wrong order, the laugh."),
        ("SELL", "Limited this week", "Something that's only available for a short time.", "Bakery: the weekend special, only Saturday."),
        ("USEFUL", "Answer a comment", "Pick a question from your comments and answer it with a video.", "Any business: \"You asked, we answered.\""),
        ("PERSONAL", "Why we do this", "One sentence about what drives you, with a real moment on screen.", "Dive shop: the face of a first-time diver coming up."),
        ("SELL", "How to book or order", "Show step by step how easy it is to buy from you.", "Salon: booking via WhatsApp in three messages."),
        ("USEFUL", "Season tip", "A tip that fits this time of year on Curaçao.", "Vacation rental: what guests should pack for the rainy season."),
        ("PERSONAL", "Then and now", "An old photo of your business next to today.", "Any business: the first sign, the new sign."),
        ("SELL", "Most asked combo", "Show what customers often buy together.", "Hardware store: the three things every new homeowner needs."),
        ("USEFUL", "Do this, not that", "Two side-by-side examples, one wrong and one right.", "Photographer: a photo with light behind you vs. light in front."),
        ("PERSONAL", "Customer shout-out", "Thank a loyal customer (with permission) and tell their story.", "Gym: a member who comes every morning at 6."),
        ("SELL", "The unboxing", "Show what a customer receives, from opening to using.", "Gift shop: a gift box opened slowly."),
        ("USEFUL", "Glossary", "Explain one word from your field people don't understand.", "Insurance: what an 'own risk' really means."),
        ("PERSONAL", "Ask your audience", "Ask a fun question that has nothing to do with selling.", "Any business: \"Best snack on the island? Wrong answers only.\""),
        ("SELL", "Month recap", "Show the best moments of the month and what's coming next.", "Any business: 10 clips, 15 seconds, one invite for next month."),
    ],
    "slot": "Save this list and tick off what you posted. At the end of the month, check which three posts did best and make more of those."
}

FIX = {
    "slug": "funkiness-5-minute-marketing-fix",
    "kicker": "Mystery FUNky Gift",
    "titel": "The 5-Minute Marketing Fix",
    "sub": "Five quick upgrades for your social media profile. Set a timer, it really takes five minutes.",
    "intro": [
        "Your profile is your shop window. Many people check it before they ever message, call or visit. These five actions make sure they understand in seconds what you do and how to reach you."
    ],
    "acties": [
        ("1 minute", "Say what you do in the first line of your bio",
         "What you do, for whom, and where. No slogans in the first line.",
         "\"Fresh lunch and coffee in Punda, Curaçao. Ready in 10 minutes.\""),
        ("1 minute", "Put what you do in your name field",
         "On Instagram, the name field is separate from your username. Add what you do next to your business name, so people searching for it can find you.",
         "\"[Your Business] | Bakery Curaçao\" instead of only \"[Your Business]\"."),
        ("1 minute", "Make it easy to reach you",
         "Add your WhatsApp or phone as a contact button, and check that the number works.",
         "Test it: tap your own button from a friend's phone."),
        ("1 minute", "Check your link",
         "Tap the link in your bio. Does it open fast on a phone and go where people need to go (booking, menu, WhatsApp)?",
         "One working link beats five links nobody clicks."),
        ("1 minute", "Pin your best three",
         "Pin the posts that best show what you do and why people love you to the top of your grid.",
         "Your best seller, a happy customer and how to book."),
    ],
    "prompt": ("Bonus prompt: your new bio",
               "Write 5 versions of an Instagram bio for [business name], a [type of business] on Curaçao. Each version: max 150 characters, first line says what we do and where, second line gives one reason to choose us, last line tells people what to do next (for example: \"WhatsApp us to book\"). Simple English, friendly, no cliches."),
    "slot": "Done? Do this check again every three months. Things change, your profile should too."
}

ALLE = [HOOKS, AI_PACK, RESCUE, IDEAS, FIX]
