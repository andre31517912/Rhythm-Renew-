import { useState, useEffect, useReducer, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// RHYTHM — Period Wellness Companion App
// ═══════════════════════════════════════════════════════════════

const PHASES = {
  menstrual: {
    name: "Menstrual Phase", emoji: "🌑", dayRange: [1, 5], color: "#B2002D",
    description: "Your body is shedding its uterine lining. Honor your need for rest.",
    energy: "Low", mood: "Introspective, tired",
    bodyInfo: "Your uterus is contracting to shed its lining. Prostaglandins cause cramps. Iron levels drop. You may feel fatigued, bloated, and emotionally sensitive.",
    bodyTips: ["Use a heating pad on your lower abdomen", "Stay hydrated — warm water with lemon helps", "Prioritize 8+ hours of sleep", "Wear comfortable clothing"],
    symptoms: ["Cramps", "Fatigue", "Bloating", "Lower back pain", "Mood changes", "Headaches"],
    nutrition: {
      focus: ["Iron-rich foods", "Warm comfort foods", "Anti-inflammatory foods", "Magnesium-rich foods", "Vitamin C for iron absorption"],
      avoid: ["Excess caffeine", "Salty foods", "Processed sugar", "Cold/raw foods", "Alcohol"],
      nutrients: ["Iron", "Magnesium", "Omega-3", "Vitamin B12", "Zinc"]
    },
    movement: {
      recommended: ["Gentle yoga", "Walking", "Light stretching", "Restorative poses", "Tai chi"],
      avoid: ["Heavy lifting", "Intense HIIT", "Extreme cardio"], intensity: "Low",
      muscleAvoid: [
        { muscle: "Heavy core / deep abdominals", reason: "Your uterus is actively contracting — intense ab work (crunches, planks, leg raises) can worsen cramps and increase intra-abdominal pressure." },
        { muscle: "Lower back (heavy load)", reason: "Prostaglandins cause inflammation around the lower back. Heavy deadlifts or back extensions add strain to an already tender area." },
        { muscle: "Pelvic floor (high-impact)", reason: "Jumping, box jumps, and running put downward pressure on the pelvic floor when it's already under stress from shedding. Stick to low-impact." }
      ],
      muscleFocus: [
        { muscle: "Hips & hip flexors", reason: "Gentle hip openers relieve cramping and tension in the pelvic area where pain concentrates." },
        { muscle: "Upper back & shoulders (gentle)", reason: "Light stretching here counteracts the tendency to curl inward and tense up from discomfort." },
        { muscle: "Hamstrings (stretch only)", reason: "Gentle hamstring stretches improve circulation to the lower body and reduce lower back pull." }
      ]
    },
    mentalWellness: {
      focus: ["Rest and self-compassion", "Journaling about feelings", "Warm baths", "Early bedtime"],
      journalPrompts: ["What does my body need right now?", "What am I ready to release?", "How can I be gentle with myself today?", "What brought me comfort this week?"],
      affirmations: ["I honor my body's need for rest.", "I am allowed to slow down.", "My cycle is a source of power.", "I am worthy of gentleness."]
    }
  },
  follicular: {
    name: "Follicular Phase", emoji: "🌒", dayRange: [6, 13], color: "#FF6B9D",
    description: "Estrogen is rising. You're feeling creative, energized, and ready for new beginnings.",
    energy: "Rising", mood: "Optimistic, creative, social",
    bodyInfo: "Your pituitary gland releases FSH, stimulating follicle growth. Estrogen climbs steadily, boosting energy, mood, and skin radiance. Your metabolism slows slightly.",
    bodyTips: ["Take advantage of increased energy for challenging tasks", "Your skin may be at its clearest — try new skincare", "Great time to schedule social events", "Experiment with new healthy foods"],
    symptoms: ["Increased energy", "Better mood", "Clearer skin", "Higher libido", "Creativity boost"],
    nutrition: {
      focus: ["Light, fresh foods", "Fermented foods", "Lean proteins", "Sprouted grains", "Colorful vegetables"],
      avoid: ["Heavy, greasy foods", "Excess dairy"],
      nutrients: ["Probiotics", "Vitamin E", "B Vitamins", "Folate"]
    },
    movement: {
      recommended: ["Cardio", "Dancing", "HIIT", "Strength training", "New workout classes", "Running"],
      avoid: [], intensity: "Medium to High",
      muscleAvoid: [
        { muscle: "None — this is your power phase!", reason: "Rising estrogen supports muscle repair and recovery. You can safely target all muscle groups and try new challenges." }
      ],
      muscleFocus: [
        { muscle: "Glutes & legs (compound)", reason: "Estrogen promotes muscle protein synthesis — squats, lunges, and deadlifts are most effective now." },
        { muscle: "Core & stability", reason: "Your coordination and balance peak as estrogen rises. Great time for new core challenges." },
        { muscle: "Cardio endurance", reason: "Your heart rate recovery is faster in this phase. Push your stamina with intervals and longer runs." }
      ]
    },
    mentalWellness: {
      focus: ["Start new projects", "Brainstorming", "Social connections", "Creative expression"],
      journalPrompts: ["What new project excites me?", "What seeds do I want to plant this cycle?", "Where do I feel most creative?", "What makes me feel alive?"],
      affirmations: ["I am full of creative potential.", "New beginnings flow to me effortlessly.", "I trust the process of growth.", "My ideas have power."]
    }
  },
  ovulatory: {
    name: "Ovulatory Phase", emoji: "🌕", dayRange: [14, 17], color: "#FF0066",
    description: "Peak energy and confidence. You're magnetic, communicative, and powerful.",
    energy: "Peak", mood: "Confident, social, magnetic",
    bodyInfo: "A surge in luteinizing hormone triggers ovulation. Estrogen peaks, making you feel your most confident. Testosterone briefly rises too, boosting drive and assertiveness.",
    bodyTips: ["Channel your confidence into big conversations", "Great time for presentations or interviews", "Stay cool — your body temperature rises slightly", "Support your liver with cruciferous vegetables"],
    symptoms: ["Peak confidence", "Heightened senses", "Slight temperature rise", "Increased social energy", "Cervical mucus changes"],
    nutrition: {
      focus: ["Raw vegetables and fruits", "Light grains like quinoa", "Anti-inflammatory foods", "Cruciferous vegetables", "Fiber-rich foods"],
      avoid: ["Processed foods", "Excess sugar", "Inflammatory oils"],
      nutrients: ["Fiber", "Antioxidants", "Glutathione", "Vitamin D"]
    },
    movement: {
      recommended: ["High-intensity workouts", "Group fitness", "Running", "Power yoga", "Circuit training", "Competitive sports"],
      avoid: [], intensity: "High",
      muscleAvoid: [
        { muscle: "Be cautious with joints", reason: "Peak estrogen can increase joint laxity and ligament looseness. Warm up thoroughly and avoid maxing out on heavy single-rep lifts to protect knees and ankles." }
      ],
      muscleFocus: [
        { muscle: "Full body — go all out", reason: "Testosterone and estrogen both peak, giving you maximum strength, power, and confidence. This is PR territory." },
        { muscle: "Upper body & shoulders", reason: "Take advantage of peak strength for push-ups, overhead press, and pull movements." },
        { muscle: "Explosive legs (plyometrics)", reason: "Jump squats, box jumps, sprints — your fast-twitch fibers fire best right now." }
      ]
    },
    mentalWellness: {
      focus: ["Important conversations", "Presentations", "Date nights", "Networking", "Asking for what you want"],
      journalPrompts: ["What truth am I ready to speak?", "Where am I shining brightest?", "What connections am I nurturing?", "How can I use this energy?"],
      affirmations: ["I radiate confidence and warmth.", "My voice matters.", "I attract what I desire.", "I am magnetic."]
    }
  },
  luteal: {
    name: "Luteal Phase", emoji: "🌘", dayRange: [18, 28], color: "#D4728C",
    description: "Progesterone rises then falls. Focus on nesting, completing tasks, and winding down.",
    energy: "Declining", mood: "Detail-oriented → emotional",
    bodyInfo: "Progesterone rises and your body prepares for a potential pregnancy. As hormones decline toward the end, PMS symptoms may appear. Your metabolism speeds up slightly.",
    bodyTips: ["You may need 200-300 extra calories per day", "Prioritize complex carbs for serotonin support", "Practice saying no to overcommitment", "Start winding down evening routines earlier"],
    symptoms: ["Breast tenderness", "Mood swings", "Food cravings", "Bloating", "Acne", "Irritability"],
    nutrition: {
      focus: ["Complex carbohydrates", "Magnesium-rich foods", "Serotonin-boosting foods", "Healthy fats", "Root vegetables", "Warm, cooked meals"],
      avoid: ["Excess salt", "Alcohol", "Caffeine", "Refined sugar", "Artificial sweeteners"],
      nutrients: ["Magnesium", "Calcium", "Vitamin B6", "Tryptophan", "Omega-3"]
    },
    movement: {
      recommended: ["Pilates", "Moderate strength training", "Swimming", "Yoga", "Walking in nature"],
      avoid: ["Overtraining", "Extreme endurance"], intensity: "Medium → Low",
      muscleAvoid: [
        { muscle: "Heavy core / intense abs", reason: "Progesterone causes bloating and water retention. Intense ab work feels uncomfortable and can worsen bloating." },
        { muscle: "Heavy lower body (max effort)", reason: "Your body temperature is higher and recovery is slower. Heavy squats and deadlifts carry more injury risk now." },
        { muscle: "High-impact anything", reason: "Rising progesterone makes you more prone to fatigue and overheating. HIIT and plyometrics drain you faster than usual." }
      ],
      muscleFocus: [
        { muscle: "Hips & glutes (moderate)", reason: "Controlled movements like Pilates leg lifts and bridges keep strength without straining." },
        { muscle: "Back & posture muscles", reason: "Gentle back work counters the forward slump that bloating and breast tenderness cause." },
        { muscle: "Flexibility / full-body stretch", reason: "Yin yoga and light stretching support your body as it prepares to wind down before menstruation." }
      ]
    },
    mentalWellness: {
      focus: ["Completing projects", "Nesting and organizing", "Boundary setting", "Self-care rituals"],
      journalPrompts: ["What needs completing before I rest?", "Where do I need better boundaries?", "What comforts me most?", "What am I grateful for today?"],
      affirmations: ["I trust the rhythm of my body.", "It is safe to slow down.", "I release what no longer serves me.", "I am enough, exactly as I am."]
    }
  }
};

const RECIPES = [
  // ── MENSTRUAL (5 days → 5 recipes) ──
  { id:'m1', phase:'menstrual', name:'Iron-Boost Lentil Soup', prepTime:30, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['iron','magnesium','vitamin-c'], ingredients:['red lentils','spinach','tomatoes','turmeric','lemon','garlic','onion','cumin'], steps:['Sauté onion and garlic in olive oil for 3 min.','Add cumin and turmeric, stir 1 min.','Add lentils, tomatoes, and 4 cups water.','Simmer 20 min until lentils are soft.','Stir in spinach, cook 2 min.','Squeeze lemon juice, season and serve warm.'], description:'Warming and iron-rich to replenish during menstruation.' },
  { id:'m2', phase:'menstrual', name:'Dark Chocolate Avocado Mousse', prepTime:10, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['magnesium','iron','omega-3'], ingredients:['avocado','cocoa powder','maple syrup','vanilla extract','almond milk','sea salt'], steps:['Blend all ingredients until silky smooth.','Chill 30 min.','Top with berries and serve.'], description:'Magnesium-rich comfort treat to ease cramps.' },
  { id:'m3', phase:'menstrual', name:'Turmeric Ginger Bone Broth', prepTime:15, dietTags:['gluten-free','dairy-free','paleo'], allergens:[], nutrients:['iron','zinc','magnesium'], ingredients:['bone broth','fresh ginger','turmeric','black pepper','garlic','sea salt','green onions'], steps:['Heat broth in a pot.','Add grated ginger and turmeric.','Simmer 10 min.','Add black pepper and garlic.','Garnish with green onions.'], description:'Deeply warming and mineral-rich for restoration.' },
  { id:'m4', phase:'menstrual', name:'Spinach & Sweet Potato Hash', prepTime:25, dietTags:['vegan','gluten-free','dairy-free','paleo'], allergens:[], nutrients:['iron','vitamin-c','magnesium'], ingredients:['sweet potato','spinach','red onion','garlic','paprika','olive oil','lemon'], steps:['Dice sweet potato, roast at 400°F for 15 min.','Sauté onion and garlic.','Add sweet potato and paprika.','Fold in spinach until wilted.','Drizzle with lemon juice.'], description:'Iron and vitamin C combo for maximum absorption.' },
  { id:'m5', phase:'menstrual', name:'Warm Beetroot & Black Bean Stew', prepTime:35, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['iron','magnesium','vitamin-c'], ingredients:['beetroot','black beans','tomatoes','cumin','smoked paprika','garlic','onion','vegetable broth','lime'], steps:['Sauté onion and garlic until soft.','Add cumin and smoked paprika, stir 30s.','Add diced beetroot, beans, tomatoes, and broth.','Simmer 25 min until beets are tender.','Squeeze lime and serve with crusty bread.'], description:'Earthy, iron-packed stew to rebuild energy during your period.' },

  // ── FOLLICULAR (8 days → 8 recipes) ──
  { id:'f1', phase:'follicular', name:'Rainbow Buddha Bowl', prepTime:25, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['probiotics','vitamin-e','folate'], ingredients:['quinoa','purple cabbage','carrots','edamame','avocado','kimchi','tahini','lemon'], steps:['Cook quinoa and let cool slightly.','Arrange all vegetables in a bowl.','Top with kimchi and avocado.','Drizzle tahini-lemon dressing.'], description:'Fresh, colorful, and packed with probiotics for rising energy.' },
  { id:'f2', phase:'follicular', name:'Citrus Salmon Salad', prepTime:20, dietTags:['gluten-free','dairy-free','pescatarian'], allergens:['fish'], nutrients:['omega-3','vitamin-e','b-vitamins'], ingredients:['salmon fillet','mixed greens','orange segments','avocado','pumpkin seeds','olive oil','lemon'], steps:['Pan-sear salmon 4 min each side.','Arrange greens on plate.','Top with orange, avocado, pumpkin seeds.','Flake salmon on top.','Dress with olive oil and lemon.'], description:'Light protein with energizing citrus for your rising phase.' },
  { id:'f3', phase:'follicular', name:'Green Goddess Smoothie', prepTime:5, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['folate','b-vitamins','probiotics'], ingredients:['banana','spinach','kefir or coconut yogurt','mango','chia seeds','fresh mint'], steps:['Blend all ingredients until smooth.','Pour and enjoy immediately.'], description:'Probiotic-rich smoothie to fuel your creative phase.' },
  { id:'f4', phase:'follicular', name:'Sprouted Grain Toast with Egg', prepTime:10, dietTags:['vegetarian'], allergens:['eggs','gluten'], nutrients:['folate','vitamin-e','b-vitamins'], ingredients:['sprouted grain bread','eggs','avocado','microgreens','everything seasoning','lemon'], steps:['Toast bread until crispy.','Fry or poach egg.','Mash avocado on toast.','Top with egg and microgreens.','Season and squeeze lemon.'], description:'Quick energy with sprouted grains perfect for the follicular phase.' },
  { id:'f5', phase:'follicular', name:'Miso Soba Noodle Bowl', prepTime:20, dietTags:['vegan','dairy-free'], allergens:['gluten','soy'], nutrients:['probiotics','b-vitamins','folate'], ingredients:['soba noodles','white miso paste','tofu','edamame','nori','green onions','sesame seeds','fresh ginger'], steps:['Cook soba noodles per package instructions, rinse with cold water.','Dissolve miso in 3 cups warm water (don\'t boil).','Cube tofu and pan-fry until golden.','Assemble noodles in bowls, pour miso broth over.','Top with tofu, edamame, nori, green onions, and sesame seeds.'], description:'Probiotic miso and energizing noodles to match your rising momentum.' },
  { id:'f6', phase:'follicular', name:'Spinach & Feta Stuffed Chicken', prepTime:30, dietTags:['gluten-free'], allergens:['dairy'], nutrients:['b-vitamins','vitamin-e','folate'], ingredients:['chicken breast','fresh spinach','feta cheese','sun-dried tomatoes','garlic','olive oil','oregano','lemon'], steps:['Preheat oven to 400°F.','Cut a pocket in each chicken breast.','Sauté spinach and garlic, cool slightly.','Mix spinach with crumbled feta and sun-dried tomatoes.','Stuff chicken, secure with toothpick.','Season with oregano, bake 22-25 min until cooked through.'], description:'High-protein with folate-rich spinach to fuel your building energy.' },
  { id:'f7', phase:'follicular', name:'Tropical Probiotic Parfait', prepTime:10, dietTags:['vegetarian','gluten-free'], allergens:['dairy'], nutrients:['probiotics','vitamin-e','b-vitamins'], ingredients:['Greek yogurt or coconut yogurt','mango','pineapple','passionfruit','granola','coconut flakes','honey'], steps:['Layer yogurt in a glass or bowl.','Add diced mango and pineapple.','Scoop passionfruit over fruit.','Top with granola and coconut flakes.','Drizzle with honey.'], description:'Bright tropical flavors with gut-friendly probiotics for your creative phase.' },
  { id:'f8', phase:'follicular', name:'Lemon Herb Shrimp & Asparagus', prepTime:15, dietTags:['gluten-free','dairy-free','pescatarian'], allergens:['shellfish'], nutrients:['folate','b-vitamins','vitamin-e'], ingredients:['shrimp','asparagus','lemon','garlic','olive oil','fresh dill','cherry tomatoes','red pepper flakes'], steps:['Heat olive oil in a pan over medium-high heat.','Add garlic and red pepper flakes, cook 30s.','Add shrimp, cook 2 min per side until pink.','Add asparagus and cherry tomatoes, cook 3 min.','Squeeze lemon, toss with fresh dill, serve immediately.'], description:'Light, quick, and loaded with folate from asparagus for your energized phase.' },

  // ── OVULATORY (4 days → 6 recipes for variety) ──
  { id:'o1', phase:'ovulatory', name:'Thai Crunch Salad', prepTime:15, dietTags:['vegan','gluten-free','dairy-free'], allergens:['soy'], nutrients:['fiber','antioxidants','vitamin-d'], ingredients:['purple cabbage','carrots','cucumber','bell pepper','cilantro','lime','tamari','sesame oil','chili flakes'], steps:['Shred cabbage, julienne carrots and pepper.','Dice cucumber, chop cilantro.','Whisk lime, tamari, sesame oil, chili.','Toss everything together.','Let sit 5 min before serving.'], description:'Crunchy, raw, and fiber-rich for your peak phase.' },
  { id:'o2', phase:'ovulatory', name:'Quinoa Stuffed Bell Peppers', prepTime:35, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['fiber','antioxidants','glutathione'], ingredients:['bell peppers','quinoa','black beans','corn','tomatoes','cumin','cilantro','lime'], steps:['Cook quinoa.','Mix quinoa with beans, corn, tomatoes, spices.','Halve peppers and remove seeds.','Fill with quinoa mixture.','Bake at 375°F for 20 min.','Garnish with cilantro and lime.'], description:'Fiber-packed and satisfying during your most energetic phase.' },
  { id:'o3', phase:'ovulatory', name:'Berry Antioxidant Acai Bowl', prepTime:10, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['antioxidants','fiber','vitamin-d'], ingredients:['acai packets','banana','mixed berries','granola','coconut flakes','hemp seeds','honey or agave'], steps:['Blend acai, banana, and half the berries.','Pour into bowl.','Top with remaining berries, granola, coconut, hemp seeds.','Drizzle with honey.'], description:'Antioxidant powerhouse for your peak energy days.' },
  { id:'o4', phase:'ovulatory', name:'Grilled Veggie & Hummus Wrap', prepTime:20, dietTags:['vegan','dairy-free'], allergens:['gluten'], nutrients:['fiber','antioxidants','glutathione'], ingredients:['whole wheat tortilla','hummus','zucchini','eggplant','red pepper','arugula','balsamic glaze'], steps:['Grill sliced vegetables until charred.','Warm tortilla.','Spread hummus generously.','Layer grilled veggies and arugula.','Drizzle balsamic, roll and serve.'], description:'Light yet satisfying wrap for your confident phase.' },
  { id:'o5', phase:'ovulatory', name:'Broccoli & Cauliflower Detox Soup', prepTime:25, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['glutathione','fiber','antioxidants'], ingredients:['broccoli','cauliflower','onion','garlic','vegetable broth','nutritional yeast','lemon','olive oil'], steps:['Sauté onion and garlic in olive oil.','Add chopped broccoli and cauliflower.','Pour in broth, simmer 15 min until tender.','Blend until creamy.','Stir in nutritional yeast and lemon juice.'], description:'Cruciferous vegetables support liver detox during estrogen peak.' },
  { id:'o6', phase:'ovulatory', name:'Mediterranean Chickpea Power Plate', prepTime:20, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['fiber','antioxidants','glutathione'], ingredients:['chickpeas','cucumber','cherry tomatoes','red onion','kalamata olives','parsley','lemon','olive oil','sumac'], steps:['Drain and rinse chickpeas, pat dry.','Dice cucumber, halve tomatoes, slice onion thinly.','Combine all vegetables with chickpeas.','Whisk lemon, olive oil, and sumac into dressing.','Toss salad, garnish with parsley and extra olives.'], description:'Light, fiber-rich plate packed with antioxidants for your peak phase.' },

  // ── LUTEAL (11 days → 11 recipes) ──
  { id:'l1', phase:'luteal', name:'Warm Sweet Potato & Kale Bowl', prepTime:30, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['magnesium','calcium','vitamin-b6','tryptophan'], ingredients:['sweet potato','kale','chickpeas','tahini','lemon','garlic','cumin','pumpkin seeds'], steps:['Roast cubed sweet potato and chickpeas at 400°F for 25 min.','Massage kale with lemon and olive oil.','Make tahini dressing with garlic and cumin.','Assemble bowl.','Top with pumpkin seeds.'], description:'Complex carbs and magnesium to soothe PMS symptoms.' },
  { id:'l2', phase:'luteal', name:'Banana Oat Pancakes', prepTime:15, dietTags:['vegetarian','dairy-free'], allergens:['eggs','gluten'], nutrients:['tryptophan','magnesium','vitamin-b6'], ingredients:['oats','banana','eggs','cinnamon','vanilla extract','maple syrup','blueberries'], steps:['Blend oats, banana, eggs, cinnamon, vanilla.','Heat pan with coconut oil.','Pour batter to make small pancakes.','Cook 2 min each side.','Top with blueberries and maple syrup.'], description:'Serotonin-boosting comfort food for the luteal phase.' },
  { id:'l3', phase:'luteal', name:'Dark Chocolate Chia Pudding', prepTime:10, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['magnesium','calcium','omega-3'], ingredients:['chia seeds','cocoa powder','oat milk','maple syrup','vanilla extract','dark chocolate chips'], steps:['Mix chia seeds, cocoa, oat milk, maple syrup, vanilla.','Stir well and refrigerate 4+ hours.','Top with dark chocolate chips.','Enjoy cold or gently warmed.'], description:'Satisfy chocolate cravings while loading up on magnesium.' },
  { id:'l4', phase:'luteal', name:'Turkey & Root Veggie Stew', prepTime:40, dietTags:['gluten-free','dairy-free','paleo'], allergens:[], nutrients:['tryptophan','vitamin-b6','magnesium','calcium'], ingredients:['ground turkey','carrots','parsnips','celery','potatoes','thyme','rosemary','garlic','bone broth'], steps:['Brown turkey in a large pot.','Add diced root vegetables and garlic.','Pour in bone broth.','Add herbs and simmer 30 min.','Season and serve warm.'], description:'Warm, grounding stew packed with tryptophan for better sleep.' },
  { id:'l5', phase:'luteal', name:'Pumpkin Spice Overnight Oats', prepTime:10, dietTags:['vegan','dairy-free'], allergens:['gluten'], nutrients:['magnesium','tryptophan','vitamin-b6'], ingredients:['rolled oats','pumpkin puree','oat milk','maple syrup','cinnamon','nutmeg','chia seeds','pecans'], steps:['Mix oats, pumpkin puree, oat milk, maple syrup, and spices.','Stir in chia seeds.','Refrigerate overnight.','Top with pecans and an extra drizzle of maple syrup.'], description:'Prep the night before and wake up to cozy, serotonin-boosting comfort.' },
  { id:'l6', phase:'luteal', name:'Creamy Butternut Squash Mac & Cheese', prepTime:35, dietTags:['vegetarian'], allergens:['dairy','gluten'], nutrients:['calcium','magnesium','vitamin-b6'], ingredients:['butternut squash','pasta','cheddar cheese','milk','garlic','nutmeg','breadcrumbs','olive oil'], steps:['Roast cubed butternut squash at 400°F for 20 min.','Cook pasta al dente.','Blend squash with milk, garlic, and nutmeg until smooth.','Melt cheese into sauce.','Toss with pasta, top with breadcrumbs, broil 3 min.'], description:'The ultimate craving-satisfying comfort food with hidden veggies and calcium.' },
  { id:'l7', phase:'luteal', name:'Salmon & Brown Rice Teriyaki Bowl', prepTime:25, dietTags:['gluten-free','dairy-free','pescatarian'], allergens:['fish','soy'], nutrients:['omega-3','tryptophan','magnesium'], ingredients:['salmon fillet','brown rice','broccoli','carrots','tamari','honey','ginger','sesame seeds','green onions'], steps:['Cook brown rice.','Whisk tamari, honey, and ginger for glaze.','Pan-sear salmon 4 min each side, brush with glaze.','Steam broccoli and carrots.','Assemble bowl, drizzle remaining glaze, top with sesame seeds.'], description:'Omega-3 rich salmon with complex carbs to stabilize mood swings.' },
  { id:'l8', phase:'luteal', name:'Comforting Lentil Shepherd\'s Pie', prepTime:45, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['magnesium','calcium','tryptophan','vitamin-b6'], ingredients:['green lentils','carrots','celery','onion','garlic','tomato paste','vegetable broth','potatoes','olive oil','thyme'], steps:['Cook lentils until just tender.','Sauté onion, carrots, celery, and garlic.','Add tomato paste and broth, simmer 15 min.','Boil and mash potatoes with olive oil.','Layer lentil mix in a baking dish, top with mash, bake at 375°F for 20 min.'], description:'Warm, hearty, and loaded with magnesium and complex carbs for PMS relief.' },
  { id:'l9', phase:'luteal', name:'Warm Cinnamon Apple & Walnut Bowl', prepTime:15, dietTags:['vegan','gluten-free','dairy-free'], allergens:['tree nuts'], nutrients:['magnesium','omega-3','calcium'], ingredients:['apples','walnuts','oat milk','cinnamon','maple syrup','almond butter','flaxseed'], steps:['Dice apples and warm in a pan with cinnamon and a splash of water.','Cook 5 min until softened.','Spoon into a bowl.','Top with walnuts, a drizzle of almond butter, and flaxseed.','Add warm oat milk and maple syrup.'], description:'Like a warm hug in a bowl — magnesium-rich walnuts and omega-3 from flax.' },
  { id:'l10', phase:'luteal', name:'Chickpea & Spinach Coconut Curry', prepTime:25, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['magnesium','calcium','vitamin-b6'], ingredients:['chickpeas','spinach','coconut milk','tomatoes','onion','garlic','ginger','curry powder','turmeric','rice'], steps:['Sauté onion, garlic, and ginger.','Add curry powder and turmeric, stir 1 min.','Add tomatoes and coconut milk, simmer 10 min.','Add chickpeas, cook 5 min.','Fold in spinach until wilted.','Serve over rice.'], description:'Creamy, warming curry that soothes cravings and delivers steady energy.' },
  { id:'l11', phase:'luteal', name:'Stuffed Baked Sweet Potatoes', prepTime:40, dietTags:['vegan','gluten-free','dairy-free'], allergens:[], nutrients:['tryptophan','magnesium','vitamin-b6','calcium'], ingredients:['sweet potatoes','black beans','corn','avocado','lime','cilantro','cumin','salsa','pumpkin seeds'], steps:['Bake sweet potatoes at 400°F for 35-40 min until soft.','Heat black beans with cumin.','Split sweet potatoes open, fluff with a fork.','Fill with beans and corn.','Top with avocado, salsa, pumpkin seeds, and cilantro.','Squeeze lime over the top.'], description:'Satisfying complex carbs with tryptophan to help with sleep and mood.' }
];

const WORKOUTS = [
  // ── MENSTRUAL ──
  { id:'mw1', phase:'menstrual', name:'Gentle Restorative Flow', type:'yoga', duration:20, intensity:'low', muscleGroups:['hips','lower back'],
    description:'Slow, supported poses to ease cramps and calm your nervous system.',
    warmup:'3 min seated deep breathing, gentle neck rolls and shoulder shrugs.',
    cooldown:'2 min savasana (corpse pose) with a pillow under your knees.',
    exercises:[
      { name:'Child\'s Pose', sets:1, hold:'60s', notes:'Knees wide, arms extended, forehead on mat' },
      { name:'Supine Spinal Twist', sets:2, hold:'45s each side', notes:'Knees together, let gravity do the work' },
      { name:'Cat-Cow Stretch', sets:1, reps:'10 slow cycles', notes:'Sync breath—inhale cow, exhale cat' },
      { name:'Reclined Butterfly (Supta Baddha Konasana)', sets:1, hold:'90s', notes:'Place blocks or pillows under knees for support' },
      { name:'Legs Up the Wall', sets:1, hold:'3 min', notes:'Reduces bloating and eases lower back tension' },
      { name:'Supported Bridge with Block', sets:1, hold:'60s', notes:'Block under sacrum on lowest setting' }
    ]
  },
  { id:'mw2', phase:'menstrual', name:'Sunset Walk', type:'walking', duration:30, intensity:'low', muscleGroups:['legs','glutes'],
    description:'A peaceful walk to gently move your body without strain.',
    warmup:'2 min standing hip circles and ankle rolls.',
    cooldown:'3 min standing quad stretch and calf stretch.',
    exercises:[
      { name:'Flat-terrain easy walk', sets:1, reps:'10 min', notes:'Keep a conversational pace, focus on breathing' },
      { name:'Gentle arm swings while walking', sets:1, reps:'5 min', notes:'Loosen shoulders, swing arms naturally' },
      { name:'Mindful slow walk', sets:1, reps:'10 min', notes:'Notice each step, connect with surroundings' },
      { name:'Standing side stretch', sets:2, hold:'30s each side', notes:'Pause mid-walk, reach one arm overhead and lean' }
    ]
  },
  { id:'mw3', phase:'menstrual', name:'Bedtime Stretch Routine', type:'stretching', duration:15, intensity:'low', muscleGroups:['back','hips','hamstrings'],
    description:'Release tension in your lower back and hips before sleep.',
    warmup:'1 min seated deep belly breathing.',
    cooldown:'2 min lying flat, eyes closed, body scan.',
    exercises:[
      { name:'Seated Forward Fold', sets:1, hold:'60s', notes:'Bend from hips, don\'t round upper back, use a strap if needed' },
      { name:'Figure-Four Stretch', sets:2, hold:'45s each side', notes:'Opens deep hip rotators, great for cramp relief' },
      { name:'Knee-to-Chest Hug', sets:2, hold:'30s each side', notes:'Gently rock side to side to massage lower back' },
      { name:'Thread the Needle', sets:2, hold:'30s each side', notes:'Opens thoracic spine and shoulders' },
      { name:'Happy Baby Pose', sets:1, hold:'60s', notes:'Hold outer feet, gently rock side to side' }
    ]
  },
  { id:'mw4', phase:'menstrual', name:'Gentle Floor Mobility', type:'stretching', duration:20, intensity:'low', muscleGroups:['hips','spine','shoulders'],
    description:'All floor-based movements to relieve cramps and stiffness without standing.',
    warmup:'2 min diaphragmatic breathing on your back.',
    cooldown:'2 min savasana with hand on belly.',
    exercises:[
      { name:'Pelvic Tilts', sets:2, reps:'12', notes:'Lying on back, gently tilt pelvis to flatten and arch lower back' },
      { name:'Windshield Wipers', sets:2, reps:'10 each side', notes:'Knees bent, feet wide, drop knees side to side' },
      { name:'90/90 Hip Switch', sets:2, reps:'8 each side', notes:'Seated, rotate legs slowly between positions' },
      { name:'Sphinx Pose', sets:1, hold:'45s', notes:'Gentle backbend, elbows under shoulders' },
      { name:'Supine Pigeon Stretch', sets:2, hold:'45s each side', notes:'Ankle over opposite knee, pull thigh toward chest' }
    ]
  },

  // ── FOLLICULAR ──
  { id:'fw1', phase:'follicular', name:'Energizing Vinyasa', type:'yoga', duration:45, intensity:'medium', muscleGroups:['full-body','core','arms'],
    description:'Dynamic flow to match your rising energy and creativity.',
    warmup:'5 min Sun Salutation A × 3 rounds.',
    cooldown:'5 min pigeon pose each side + seated meditation.',
    exercises:[
      { name:'Sun Salutation B', sets:3, reps:'full flow', notes:'Hold Warrior I for 3 breaths each side' },
      { name:'Warrior II → Reverse Warrior → Extended Side Angle', sets:2, reps:'flow each side', notes:'Build heat in legs, open chest' },
      { name:'Chair Pose (Utkatasana)', sets:3, hold:'30s', notes:'Sit deep, arms overhead, engage core' },
      { name:'Chaturanga → Updog → Downdog', sets:5, reps:'flow', notes:'Build upper body and core strength' },
      { name:'Boat Pose (Navasana)', sets:3, hold:'20s', notes:'Straight legs if possible, modify with bent knees' },
      { name:'Crow Pose (Bakasana)', sets:3, hold:'10-15s', notes:'Optional — practice with a block or skip if not ready' }
    ]
  },
  { id:'fw2', phase:'follicular', name:'Dance Cardio Party', type:'dancing', duration:30, intensity:'medium', muscleGroups:['full-body','cardio','core'],
    description:'Let loose and have fun with upbeat dance cardio.',
    warmup:'3 min light march in place + arm circles.',
    cooldown:'3 min slow swaying + standing forward fold.',
    exercises:[
      { name:'Grapevine + Clap', sets:3, reps:'1 min each direction', notes:'Step-together-step, add arm movements' },
      { name:'Body Roll + Squat Combo', sets:3, reps:'45s', notes:'Roll torso, drop into half squat, pop up' },
      { name:'Kick-Ball-Change', sets:4, reps:'30s each lead', notes:'Classic dance move, keep it bouncy' },
      { name:'Side Shuffle + Jump', sets:3, reps:'1 min', notes:'Shuffle 4 steps right, jump, shuffle left' },
      { name:'Hip Circles + Arm Waves', sets:2, reps:'1 min', notes:'Isolate hips, add flowing arm work for coordination' },
      { name:'Free Dance Burnout', sets:1, reps:'3 min', notes:'Put on your favorite song, go all out!' }
    ]
  },
  { id:'fw3', phase:'follicular', name:'Full Body Strength', type:'strength training', duration:40, intensity:'medium', muscleGroups:['glutes','legs','arms','core'],
    description:'Build strength with compound movements while estrogen supports muscle recovery.',
    warmup:'5 min jumping jacks + bodyweight squats + arm circles.',
    cooldown:'5 min full-body stretch (quads, hamstrings, chest opener).',
    exercises:[
      { name:'Goblet Squats', sets:3, reps:'12', notes:'Hold weight at chest, sit deep, drive through heels' },
      { name:'Dumbbell Romanian Deadlift', sets:3, reps:'10', notes:'Hinge at hips, slight knee bend, feel hamstrings stretch' },
      { name:'Push-Ups (or Knee Push-Ups)', sets:3, reps:'10-12', notes:'Full range of motion, core tight' },
      { name:'Bent-Over Dumbbell Rows', sets:3, reps:'12 each arm', notes:'Pull elbow to hip, squeeze shoulder blade' },
      { name:'Glute Bridges', sets:3, reps:'15', notes:'Pause and squeeze at the top for 2s' },
      { name:'Plank Hold', sets:3, hold:'30-45s', notes:'Keep hips level, breathe steadily' }
    ]
  },
  { id:'fw4', phase:'follicular', name:'Interval Run', type:'running', duration:25, intensity:'high', muscleGroups:['legs','cardio','core'],
    description:'Sprint intervals to channel your building energy. Estrogen helps your endurance.',
    warmup:'5 min easy jog + dynamic leg swings.',
    cooldown:'3 min walk + standing quad and calf stretch.',
    exercises:[
      { name:'Easy Jog', sets:1, reps:'3 min', notes:'Warm up your pace, find your rhythm' },
      { name:'Sprint Interval', sets:6, reps:'30s sprint / 60s walk', notes:'80-90% effort on sprints, fully recover on walks' },
      { name:'Tempo Run', sets:1, reps:'5 min', notes:'Comfortably hard pace — you can say short phrases' },
      { name:'Hill Sprints (or incline treadmill)', sets:4, reps:'20s', notes:'If available, otherwise increase sprint effort' },
      { name:'Cool-Down Jog', sets:1, reps:'3 min', notes:'Gradually slow to a walk' }
    ]
  },

  // ── OVULATORY ──
  { id:'ow1', phase:'ovulatory', name:'Power HIIT Circuit', type:'hiit', duration:30, intensity:'high', muscleGroups:['full-body','cardio','core'],
    description:'Maximum intensity to match your peak energy and testosterone boost.',
    warmup:'4 min skaters + high knees + arm swings.',
    cooldown:'4 min child\'s pose + standing forward fold + deep breathing.',
    exercises:[
      { name:'Burpees', sets:4, reps:'10', notes:'Full burpee with push-up and jump' },
      { name:'Jump Squats', sets:4, reps:'15', notes:'Explode up, land soft, sit low' },
      { name:'Mountain Climbers', sets:4, reps:'20 each leg', notes:'Fast pace, keep hips low and core tight' },
      { name:'Box Jumps (or Step-Ups)', sets:3, reps:'10', notes:'Use a sturdy box or bench, land with both feet' },
      { name:'Plank Jacks', sets:3, reps:'20', notes:'Feet jump out and in, hold plank position' },
      { name:'Bicycle Crunches', sets:3, reps:'20 each side', notes:'Slow and controlled, elbow to opposite knee' }
    ]
  },
  { id:'ow2', phase:'ovulatory', name:'Power Yoga Flow', type:'yoga', duration:50, intensity:'high', muscleGroups:['full-body','core','arms','shoulders'],
    description:'Challenging arm balances and inversions for your strongest days.',
    warmup:'5 min Sun Salutation A × 4 + core warm-up.',
    cooldown:'5 min pigeon pose + reclined twist + savasana.',
    exercises:[
      { name:'Warrior III (Virabhadrasana III)', sets:3, hold:'20s each side', notes:'Strong standing leg, reach arms forward' },
      { name:'Side Plank (Vasisthasana)', sets:3, hold:'20s each side', notes:'Stack feet or stagger, reach top arm up' },
      { name:'Crow Pose (Bakasana)', sets:4, hold:'15s', notes:'Lean forward, knees on triceps, lift feet' },
      { name:'Headstand Prep or Full Headstand', sets:3, hold:'20-30s', notes:'Against a wall if needed — skip if not comfortable' },
      { name:'Wheel Pose (Urdhva Dhanurasana)', sets:2, hold:'15s', notes:'Press up from bridge, straighten arms and legs' },
      { name:'Firefly Pose (Tittibhasana)', sets:3, hold:'10s', notes:'Advanced — use blocks or substitute with boat pose' }
    ]
  },
  { id:'ow3', phase:'ovulatory', name:'Outdoor Run', type:'running', duration:40, intensity:'high', muscleGroups:['legs','cardio','glutes'],
    description:'Push your pace during your highest-energy phase. Your body can handle more now.',
    warmup:'5 min easy jog + dynamic lunges.',
    cooldown:'5 min walk + hip flexor and hamstring stretch.',
    exercises:[
      { name:'Easy Warm-Up Jog', sets:1, reps:'5 min', notes:'Gradually build pace' },
      { name:'Tempo Run', sets:1, reps:'15 min', notes:'Push to 70-80% effort, steady pace' },
      { name:'Fartlek Intervals', sets:6, reps:'1 min fast / 1 min easy', notes:'Unstructured speed play' },
      { name:'Hill Repeats', sets:3, reps:'45s uphill, walk down', notes:'Find a hill or use treadmill incline' },
      { name:'Negative Split Finish', sets:1, reps:'5 min', notes:'Run the last stretch faster than you started' }
    ]
  },
  { id:'ow4', phase:'ovulatory', name:'Upper Body Power', type:'strength training', duration:35, intensity:'high', muscleGroups:['chest','shoulders','arms','core'],
    description:'Capitalize on peak strength for upper body gains.',
    warmup:'4 min band pull-aparts + arm circles + light push-ups.',
    cooldown:'4 min chest stretch in doorway + tricep stretch + child\'s pose.',
    exercises:[
      { name:'Push-Up Variations (wide, diamond, decline)', sets:3, reps:'8-10 each', notes:'Pick 2-3 variations, go to near failure' },
      { name:'Dumbbell Shoulder Press', sets:3, reps:'10', notes:'Seated or standing, full range overhead' },
      { name:'Bent-Over Rows', sets:3, reps:'12', notes:'Both arms or alternating, squeeze at top' },
      { name:'Tricep Dips (bench or chair)', sets:3, reps:'12', notes:'Keep elbows close, don\'t flare' },
      { name:'Bicep Curls → Hammer Curls superset', sets:3, reps:'10 + 10', notes:'No rest between the two, rest after both' },
      { name:'Dead Bug', sets:3, reps:'10 each side', notes:'Lower opposite arm and leg, keep back flat' }
    ]
  },

  // ── LUTEAL ──
  { id:'lw1', phase:'luteal', name:'Pilates Core & Stretch', type:'pilates', duration:35, intensity:'medium', muscleGroups:['core','back','hips'],
    description:'Controlled movements to maintain strength as energy shifts. Avoid heavy straining.',
    warmup:'3 min pelvic tilts + breathing + gentle roll-down.',
    cooldown:'4 min seated spinal twist + figure-four stretch.',
    exercises:[
      { name:'The Hundred', sets:1, reps:'100 pumps (10 breaths)', notes:'Legs at 45° or tabletop for modification' },
      { name:'Single Leg Stretch', sets:2, reps:'10 each side', notes:'Alternate pulling knee to chest, extend other leg' },
      { name:'Pilates Roll-Up', sets:2, reps:'8', notes:'Articulate through spine, use a band if needed' },
      { name:'Side-Lying Leg Lifts', sets:2, reps:'15 each side', notes:'Keep hips stacked, slow and controlled' },
      { name:'Swimming (Prone)', sets:2, reps:'10 each side', notes:'Alternate arm and leg lifts on belly' },
      { name:'Spine Stretch Forward', sets:2, reps:'6', notes:'Seated, round forward over legs, stretch back' }
    ]
  },
  { id:'lw2', phase:'luteal', name:'Nature Walk', type:'walking', duration:40, intensity:'low', muscleGroups:['legs','glutes'],
    description:'Connect with nature as you wind down. Walking helps ease PMS bloating.',
    warmup:'2 min hip circles + calf raises.',
    cooldown:'3 min standing figure-four + quad stretch.',
    exercises:[
      { name:'Steady-pace flat walk', sets:1, reps:'15 min', notes:'Moderate pace, arms swinging naturally' },
      { name:'Walk with deep breathing intervals', sets:4, reps:'2 min each', notes:'Inhale 4 counts, exhale 6 counts while walking' },
      { name:'Gentle incline walk', sets:1, reps:'10 min', notes:'Find a slight hill or set treadmill to 3-4% incline' },
      { name:'Standing balance check', sets:2, hold:'30s each leg', notes:'Pause trail-side, stand on one foot, notice stability' }
    ]
  },
  { id:'lw3', phase:'luteal', name:'Yin Yoga', type:'yoga', duration:45, intensity:'low', muscleGroups:['hips','back','hamstrings'],
    description:'Long-held poses to release deep tension and prepare for rest. All floor-based.',
    warmup:'2 min cross-legged deep breathing + neck rolls.',
    cooldown:'3 min savasana with blanket.',
    exercises:[
      { name:'Butterfly (Baddha Konasana)', sets:1, hold:'3 min', notes:'Fold forward, let head hang, use a bolster' },
      { name:'Dragon Pose (Low Lunge)', sets:2, hold:'2 min each side', notes:'Deep hip flexor stretch, use blocks under hands' },
      { name:'Sleeping Swan (Pigeon)', sets:2, hold:'3 min each side', notes:'Fold forward over front shin, breathe into hips' },
      { name:'Caterpillar (Seated Forward Fold)', sets:1, hold:'3 min', notes:'Let spine round, don\'t force — gravity does the work' },
      { name:'Reclined Spinal Twist', sets:2, hold:'2 min each side', notes:'Keep both shoulders grounded, breathe deeply' }
    ]
  },
  { id:'lw4', phase:'luteal', name:'Swimming Laps', type:'swimming', duration:30, intensity:'medium', muscleGroups:['full-body','cardio','shoulders'],
    description:'Low-impact full-body movement that feels weightless. Water eases joint pressure.',
    warmup:'3 min easy freestyle + 2 min kicking with board.',
    cooldown:'3 min backstroke + in-water stretching.',
    exercises:[
      { name:'Freestyle Laps', sets:4, reps:'50m', notes:'Steady pace, focus on long strokes and breathing rhythm' },
      { name:'Backstroke Laps', sets:3, reps:'50m', notes:'Opens chest, great for posture — gentle on lower back' },
      { name:'Kickboard Laps', sets:3, reps:'25m', notes:'Isolate legs, flutter kick, core engaged' },
      { name:'Pull Buoy Laps', sets:2, reps:'50m', notes:'Isolate arms, great for upper body without taxing legs' },
      { name:'Treading Water', sets:2, hold:'60s', notes:'Gentle full-body engagement, keep head above water' }
    ]
  }
];

const MEDITATIONS = [
  { id:'med1', name:'Body Scan for Cramps', duration:10, category:'cycle-specific', phase:'menstrual', description:'Gently release tension throughout your body.' },
  { id:'med2', name:'Sleep Wind-Down', duration:15, category:'sleep', phase:'all', description:'Drift into restful sleep with guided relaxation.' },
  { id:'med3', name:'Morning Energy Boost', duration:7, category:'focus', phase:'follicular', description:'Start your day with intention and clarity.' },
  { id:'med4', name:'Confidence Visualization', duration:10, category:'focus', phase:'ovulatory', description:'Step into your most confident, magnetic self.' },
  { id:'med5', name:'Stress Release', duration:12, category:'stress', phase:'luteal', description:'Let go of tension and find your center.' },
  { id:'med6', name:'Gratitude Practice', duration:8, category:'stress', phase:'all', description:'Cultivate thankfulness and inner peace.' },
  { id:'med7', name:'Breath of Calm', duration:5, category:'stress', phase:'all', description:'Quick breathing exercise for instant relief.' },
  { id:'med8', name:'Self-Love Meditation', duration:15, category:'cycle-specific', phase:'menstrual', description:'Wrap yourself in compassion and warmth.' }
];

// ─── Utility Functions ───
function getCurrentPhase(lastPeriodDate, cycleLength, periodDuration) {
  if (!lastPeriodDate) return { phase: 'follicular', day: 7, totalDays: 28 };
  const today = new Date();
  const lpd = new Date(lastPeriodDate);
  const diffTime = today.getTime() - lpd.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayInCycle = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
  let phase = 'luteal';
  if (dayInCycle <= periodDuration) phase = 'menstrual';
  else if (dayInCycle <= 13) phase = 'follicular';
  else if (dayInCycle <= 17) phase = 'ovulatory';
  return { phase, day: dayInCycle, totalDays: cycleLength };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function filterRecipes(recipes, phase, dietPrefs, allergies) {
  return recipes.filter(r => {
    if (r.phase !== phase) return false;
    if (allergies.length > 0) {
      const allergenLower = allergies.map(a => a.toLowerCase());
      for (const ing of r.ingredients) {
        if (allergenLower.some(a => ing.toLowerCase().includes(a))) return false;
      }
      if (r.allergens.some(a => allergenLower.includes(a.toLowerCase()))) return false;
    }
    if (dietPrefs.length > 0 && !dietPrefs.includes('No restrictions')) {
      const prefLower = dietPrefs.map(d => d.toLowerCase().replace('-', ''));
      const tagLower = r.dietTags.map(t => t.toLowerCase().replace('-', ''));
      const isMatch = prefLower.some(p => tagLower.includes(p));
      if (!isMatch && prefLower.length > 0) {
        const strictDiets = ['vegan', 'vegetarian', 'pescatarian', 'keto', 'paleo'];
        const hasStrict = prefLower.some(p => strictDiets.includes(p));
        if (hasStrict) return false;
      }
    }
    return true;
  });
}

function filterWorkouts(workouts, phase, prefs) {
  return workouts.filter(w => {
    if (w.phase !== phase) return false;
    if (prefs.length > 0) {
      const prefLower = prefs.map(p => p.toLowerCase());
      if (!prefLower.some(p => w.type.toLowerCase().includes(p))) return false;
    }
    return true;
  });
}

// ─── Styles ───
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

:root {
  --pink: #FF0066;
  --rose: #D4728C;
  --bg-pink: #FCE4EC;
  --blush: #FDF0F3;
  --deep-red: #B2002D;
  --maroon: #4A0E2B;
  --white: #FFFFFF;
  --gray: #F5F5F5;
  --text: #2D1B2E;
  --text-light: #8B6B8D;
  --phase-color: #FF0066;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; background: #f8f0f2; }

.rhythm-app {
  max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--white);
  position: relative; overflow-x: hidden; font-family: 'DM Sans', sans-serif;
}

.display-font { font-family: 'Fraunces', serif; font-weight: 900; font-style: italic; }

/* Wave Header */
.wave-header {
  position: relative; width: 100%; height: 180px;
  background: linear-gradient(135deg, var(--phase-color) 0%, var(--rose) 60%, var(--bg-pink) 100%);
  overflow: hidden;
}
.wave-header::after {
  content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 50px;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFFFFF' d='M0,40 C360,100 1080,0 1440,40 L1440,100 L0,100 Z'/%3E%3C/svg%3E") no-repeat bottom;
  background-size: cover;
}
.wave-header-logo {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  color: white; font-size: 36px; text-shadow: 0 2px 12px rgba(0,0,0,0.1);
  letter-spacing: 1px; z-index: 2;
}

/* Animations */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.fade-in { animation: fadeIn 0.5s ease-out forwards; }
.fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
.slide-in { animation: slideInRight 0.4s ease-out forwards; }
.stagger-1 { animation-delay: 0.1s; opacity: 0; }
.stagger-2 { animation-delay: 0.2s; opacity: 0; }
.stagger-3 { animation-delay: 0.3s; opacity: 0; }
.stagger-4 { animation-delay: 0.4s; opacity: 0; }
.stagger-5 { animation-delay: 0.5s; opacity: 0; }

/* Bottom Nav */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  max-width: 430px; width: 100%; background: white;
  display: flex; justify-content: space-around; align-items: center;
  padding: 8px 0 24px; border-top: 1px solid #f0e0e5;
  box-shadow: 0 -4px 20px rgba(212,114,140,0.08); z-index: 100;
}
.bottom-nav button {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  background: none; border: none; cursor: pointer; padding: 4px 12px;
  color: var(--text-light); font-size: 10px; font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.bottom-nav button.active { color: var(--phase-color); }
.bottom-nav button.add-btn {
  background: var(--phase-color); color: white; border-radius: 50%;
  width: 48px; height: 48px; padding: 0; margin-top: -20px;
  box-shadow: 0 4px 15px rgba(255,0,102,0.3); font-size: 24px;
  display: flex; align-items: center; justify-content: center;
}

/* Cards */
.card {
  background: var(--blush); border-radius: 16px; padding: 16px;
  transition: all 0.2s; cursor: pointer;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212,114,140,0.15); }
.card-pink { background: var(--bg-pink); }

/* Buttons */
.btn-primary {
  background: var(--phase-color); color: white; border: none; border-radius: 25px;
  padding: 14px 32px; font-size: 16px; font-weight: 600; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(255,0,102,0.25);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,0,102,0.35); }
.btn-secondary {
  background: var(--blush); color: var(--phase-color); border: 2px solid var(--phase-color);
  border-radius: 25px; padding: 12px 28px; font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
}

/* Chips */
.chip {
  display: inline-flex; align-items: center; padding: 8px 16px; border-radius: 20px;
  font-size: 13px; cursor: pointer; transition: all 0.2s; border: 1.5px solid #e8d0d8;
  background: white; color: var(--text); margin: 4px; user-select: none;
}
.chip.selected { background: var(--phase-color); color: white; border-color: var(--phase-color); }

/* Input */
.input-field {
  width: 100%; padding: 14px 16px; border: 2px solid #e8d0d8; border-radius: 12px;
  font-size: 15px; font-family: 'DM Sans', sans-serif; outline: none;
  transition: border-color 0.2s; background: var(--blush);
}
.input-field:focus { border-color: var(--phase-color); }

/* Phase ring */
.phase-ring {
  width: 160px; height: 160px; border-radius: 50%; position: relative;
  display: flex; align-items: center; justify-content: center;
}
.phase-ring-inner {
  width: 120px; height: 120px; border-radius: 50%; background: white;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
}

/* Watermark text */
.watermark {
  position: absolute; font-size: 72px; color: var(--blush); z-index: 0;
  pointer-events: none; white-space: nowrap;
}

/* Scrollable content */
.screen-content { padding: 0 20px 100px; }

/* Meditation timer */
.timer-circle {
  width: 200px; height: 200px; border-radius: 50%;
  border: 6px solid var(--bg-pink); display: flex; align-items: center;
  justify-content: center; position: relative;
}
.timer-circle.active { border-color: var(--phase-color); animation: breathe 4s ease-in-out infinite; }

/* Slider */
input[type="range"] {
  -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px;
  background: var(--bg-pink); outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
  background: var(--phase-color); cursor: pointer; box-shadow: 0 2px 6px rgba(255,0,102,0.3);
}

/* Auth Screens */
.auth-container {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 40px 24px; background: linear-gradient(180deg, var(--blush) 0%, white 100%);
}
.auth-card {
  width: 100%; max-width: 380px; background: white; border-radius: 24px;
  padding: 32px 24px; box-shadow: 0 8px 40px rgba(212,114,140,0.12);
}

/* Quick Log Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(45,27,46,0.5);
  z-index: 200; display: flex; align-items: flex-end; justify-content: center;
}
.modal-content {
  max-width: 430px; width: 100%; background: white; border-radius: 24px 24px 0 0;
  padding: 24px; padding-bottom: 40px; animation: fadeInUp 0.3s ease-out;
}
.modal-handle {
  width: 40px; height: 4px; background: #ddd; border-radius: 2px;
  margin: 0 auto 16px;
}
`;

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function RhythmApp() {
  // ─── Auth State ───
  const [authScreen, setAuthScreen] = useState('splash'); // splash, welcome, login, signup, app
  const [authUser, setAuthUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ─── App State ───
  const [screen, setScreen] = useState('onboarding');
  const [onboardStep, setOnboardStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300);
  const [meditationRemaining, setMeditationRemaining] = useState(300);
  const [wellnessTab, setWellnessTab] = useState('mind');
  const [journalText, setJournalText] = useState('');
  const [todayMood, setTodayMood] = useState(null);
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState(null);
  const timerRef = useRef(null);

  // ─── User Data ───
  const [userData, setUserData] = useState({
    name: '', age: '', cycleLength: 28, periodDuration: 5,
    lastPeriodDate: '', regularity: 'regular',
    dietPreferences: [], allergies: [], nutritionGoals: [],
    workoutPreferences: [], fitnessLevel: 'beginner', physicalLimitations: '',
    stressRelief: [], stressLevel: 3, sleepQuality: 3,
    journalEntries: [], moodLog: []
  });

  // ─── Persistent Storage for Journal & Auth ───
  useEffect(() => {
    async function loadUser() {
      try {
        const session = await window.storage.get('rhythm-session');
        if (session?.value) {
          const parsed = JSON.parse(session.value);
          setAuthUser(parsed);
          // Load user data
          const ud = await window.storage.get(`rhythm-userdata-${parsed.email}`);
          if (ud?.value) {
            const data = JSON.parse(ud.value);
            setUserData(data);
            if (data.name && data.lastPeriodDate) setScreen('home');
            else setScreen('onboarding');
          }
          setAuthScreen('app');
        } else {
          setTimeout(() => setAuthScreen('welcome'), 2000);
        }
      } catch {
        setTimeout(() => setAuthScreen('welcome'), 2000);
      }
    }
    loadUser();
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    if (authUser?.email && userData.name) {
      try {
        window.storage.set(`rhythm-userdata-${authUser.email}`, JSON.stringify(userData));
      } catch {}
    }
  }, [userData, authUser]);

  // ─── Auth Functions ───
  async function handleSignup() {
    if (!authEmail || !authPass || !authName) { setAuthError('Please fill in all fields.'); return; }
    if (authPass.length < 4) { setAuthError('Password must be at least 4 characters.'); return; }
    setAuthLoading(true); setAuthError('');
    try {
      const existing = await window.storage.get(`rhythm-user-${authEmail}`);
      if (existing?.value) { setAuthError('An account with this email already exists.'); setAuthLoading(false); return; }
      const user = { email: authEmail, name: authName, pass: authPass, created: new Date().toISOString() };
      await window.storage.set(`rhythm-user-${authEmail}`, JSON.stringify(user));
      await window.storage.set('rhythm-session', JSON.stringify({ email: authEmail, name: authName }));
      setAuthUser({ email: authEmail, name: authName });
      setUserData(prev => ({ ...prev, name: authName }));
      setAuthScreen('app'); setScreen('onboarding');
    } catch { setAuthError('Something went wrong. Please try again.'); }
    setAuthLoading(false);
  }

  async function handleLogin() {
    if (!authEmail || !authPass) { setAuthError('Please fill in all fields.'); return; }
    setAuthLoading(true); setAuthError('');
    try {
      const existing = await window.storage.get(`rhythm-user-${authEmail}`);
      if (!existing?.value) { setAuthError('No account found with this email.'); setAuthLoading(false); return; }
      const user = JSON.parse(existing.value);
      if (user.pass !== authPass) { setAuthError('Incorrect password.'); setAuthLoading(false); return; }
      await window.storage.set('rhythm-session', JSON.stringify({ email: authEmail, name: user.name }));
      setAuthUser({ email: authEmail, name: user.name });
      // Load saved data
      const ud = await window.storage.get(`rhythm-userdata-${authEmail}`);
      if (ud?.value) {
        const data = JSON.parse(ud.value);
        setUserData(data);
        setAuthScreen('app');
        if (data.name && data.lastPeriodDate) setScreen('home');
        else setScreen('onboarding');
      } else {
        setUserData(prev => ({ ...prev, name: user.name }));
        setAuthScreen('app'); setScreen('onboarding');
      }
    } catch { setAuthError('Something went wrong. Please try again.'); }
    setAuthLoading(false);
  }

  async function handleLogout() {
    try { await window.storage.delete('rhythm-session'); } catch {}
    setAuthUser(null); setAuthScreen('welcome'); setScreen('onboarding'); setOnboardStep(0);
    setAuthEmail(''); setAuthPass(''); setAuthName(''); setAuthError('');
    setUserData({
      name: '', age: '', cycleLength: 28, periodDuration: 5,
      lastPeriodDate: '', regularity: 'regular',
      dietPreferences: [], allergies: [], nutritionGoals: [],
      workoutPreferences: [], fitnessLevel: 'beginner', physicalLimitations: '',
      stressRelief: [], stressLevel: 3, sleepQuality: 3,
      journalEntries: [], moodLog: []
    });
  }

  // ─── Phase Calculation ───
  const { phase: currentPhase, day: cycleDay, totalDays } = getCurrentPhase(
    userData.lastPeriodDate, userData.cycleLength, userData.periodDuration
  );
  const phaseData = PHASES[currentPhase];
  const phaseColor = phaseData?.color || '#FF0066';

  // ─── Filtered Content ───
  const filteredRecipes = filterRecipes(RECIPES, currentPhase, userData.dietPreferences, userData.allergies);
  const allPhaseRecipes = RECIPES.filter(r => r.phase === currentPhase);
  const recipesToShow = filteredRecipes.length > 0 ? filteredRecipes : allPhaseRecipes;
  const filteredWorkouts = filterWorkouts(WORKOUTS, currentPhase, userData.workoutPreferences);
  const allPhaseWorkouts = WORKOUTS.filter(w => w.phase === currentPhase);
  const workoutsToShow = filteredWorkouts.length > 0 ? filteredWorkouts : allPhaseWorkouts;
  const phaseMeditations = MEDITATIONS.filter(m => m.phase === currentPhase || m.phase === 'all');

  // ─── Daily Suggestions (rotate items by day within phase) ───
  function getDailyItem(items, dayInPhase) {
    if (!items || items.length === 0) return null;
    return items[(dayInPhase - 1) % items.length];
  }
  function getDailyItemsForPhase(phaseName) {
    const pr = filterRecipes(RECIPES, phaseName, userData.dietPreferences, userData.allergies);
    const recipes = pr.length > 0 ? pr : RECIPES.filter(r => r.phase === phaseName);
    const pw = filterWorkouts(WORKOUTS, phaseName, userData.workoutPreferences);
    const workouts = pw.length > 0 ? pw : WORKOUTS.filter(w => w.phase === phaseName);
    const meditations = MEDITATIONS.filter(m => m.phase === phaseName || m.phase === 'all');
    return { recipes, workouts, meditations };
  }
  const phaseStartDay = PHASES[currentPhase].dayRange[0];
  const dayInPhase = cycleDay - phaseStartDay + 1;
  const todayRecipe = getDailyItem(recipesToShow, dayInPhase);
  const todayWorkout = getDailyItem(workoutsToShow, dayInPhase);
  const todayMeditation = getDailyItem(phaseMeditations, dayInPhase);
  const todayTip = getDailyItem(phaseData.bodyTips, dayInPhase);
  const todayNutritionFocus = getDailyItem(phaseData.nutrition.focus, dayInPhase);
  const todayJournalPrompt = getDailyItem(phaseData.mentalWellness.journalPrompts, dayInPhase);

  // ─── Meditation Timer ───
  useEffect(() => {
    if (meditationActive && meditationRemaining > 0) {
      timerRef.current = setInterval(() => setMeditationRemaining(prev => prev - 1), 1000);
    } else if (meditationRemaining <= 0) {
      setMeditationActive(false);
    }
    return () => clearInterval(timerRef.current);
  }, [meditationActive, meditationRemaining]);

  function formatTime(s) {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // ─── Helpers ───
  function updateField(field, val) { setUserData(prev => ({ ...prev, [field]: val })); }
  function toggleArrayItem(field, item) {
    setUserData(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  }
  function addJournalEntry() {
    if (!journalText.trim()) return;
    const entry = {
      id: Date.now(), text: journalText, date: new Date().toISOString(),
      mood: todayMood, phase: currentPhase
    };
    setUserData(prev => ({ ...prev, journalEntries: [entry, ...prev.journalEntries] }));
    setJournalText(''); setTodayMood(null);
  }

  // ─── Phase progress ───
  const phaseProgress = (cycleDay / totalDays) * 100;
  const circumference = 2 * Math.PI * 65;
  const strokeDashoffset = circumference - (phaseProgress / 100) * circumference;

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  // ─── SPLASH SCREEN ───
  if (authScreen === 'splash') {
    return (
      <div className="rhythm-app" style={{ '--phase-color': '#FF0066' }}>
        <style>{css}</style>
        <div className="auth-container" style={{ background: 'linear-gradient(180deg, #FCE4EC 0%, #FDF0F3 50%, white 100%)' }}>
          <div style={{ textAlign: 'center' }} className="fade-in">
            <div className="display-font" style={{ fontSize: 56, color: '#D4728C', marginBottom: 12 }}>Rhythm</div>
            <p style={{ color: '#8B6B8D', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>Your cycle companion</p>
            <div style={{ marginTop: 40, display: 'flex', gap: 6, justifyContent: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4728C', opacity: 0.5,
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── WELCOME SCREEN ───
  if (authScreen === 'welcome') {
    return (
      <div className="rhythm-app" style={{ '--phase-color': '#FF0066' }}>
        <style>{css}</style>
        <div className="auth-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }} className="fade-in-up">
            <div className="display-font" style={{ fontSize: 52, color: '#D4728C', marginBottom: 8 }}>Rhythm</div>
            <p style={{ color: '#8B6B8D', fontSize: 16, lineHeight: 1.5, maxWidth: 280, margin: '0 auto' }}>
              Work with your cycle, not against it. Personalized nutrition, movement, and wellness — in sync with you.
            </p>
          </div>
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-up stagger-2">
            <button className="btn-primary" style={{ width: '100%', fontSize: 17 }} onClick={() => { setAuthScreen('signup'); setAuthError(''); }}>
              Get Started
            </button>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => { setAuthScreen('login'); setAuthError(''); }}>
              I already have an account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ───
  if (authScreen === 'login') {
    return (
      <div className="rhythm-app" style={{ '--phase-color': '#FF0066' }}>
        <style>{css}</style>
        <div className="auth-container">
          <div className="auth-card fade-in-up">
            <div className="display-font" style={{ fontSize: 32, color: '#D4728C', textAlign: 'center', marginBottom: 4 }}>Welcome Back</div>
            <p style={{ color: '#8B6B8D', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>Sign in to continue your rhythm</p>
            {authError && <div style={{ background: '#FFF0F3', color: '#B2002D', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{authError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <input className="input-field" type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
              <input className="input-field" type="password" placeholder="Password" value={authPass} onChange={e => setAuthPass(e.target.value)} />
            </div>
            <button className="btn-primary" style={{ width: '100%', opacity: authLoading ? 0.6 : 1 }} onClick={handleLogin} disabled={authLoading}>
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8B6B8D' }}>
              Don't have an account? <span style={{ color: '#FF0066', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthScreen('signup'); setAuthError(''); }}>Sign up</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── SIGNUP SCREEN ───
  if (authScreen === 'signup') {
    return (
      <div className="rhythm-app" style={{ '--phase-color': '#FF0066' }}>
        <style>{css}</style>
        <div className="auth-container">
          <div className="auth-card fade-in-up">
            <div className="display-font" style={{ fontSize: 32, color: '#D4728C', textAlign: 'center', marginBottom: 4 }}>Join Rhythm</div>
            <p style={{ color: '#8B6B8D', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>Create your account to get started</p>
            {authError && <div style={{ background: '#FFF0F3', color: '#B2002D', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{authError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <input className="input-field" type="text" placeholder="Your name" value={authName} onChange={e => setAuthName(e.target.value)} />
              <input className="input-field" type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
              <input className="input-field" type="password" placeholder="Password" value={authPass} onChange={e => setAuthPass(e.target.value)} />
            </div>
            <button className="btn-primary" style={{ width: '100%', opacity: authLoading ? 0.6 : 1 }} onClick={handleSignup} disabled={authLoading}>
              {authLoading ? 'Creating account...' : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8B6B8D' }}>
              Already have an account? <span style={{ color: '#FF0066', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthScreen('login'); setAuthError(''); }}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN APP (authScreen === 'app')
  // ═══════════════════════════════════════════════════════════

  // ─── ONBOARDING ───
  if (screen === 'onboarding') {
    const steps = [
      // Step 0: Basics
      <div key="s0" className="fade-in-up">
        <div className="display-font" style={{ fontSize: 28, color: phaseColor, marginBottom: 4 }}>Tell us about you</div>
        <p style={{ color: '#8B6B8D', marginBottom: 24, fontSize: 14 }}>Let's personalize your experience, {userData.name || 'friend'}.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 4, display: 'block' }}>What should we call you?</label>
            <input className="input-field" value={userData.name} onChange={e => updateField('name', e.target.value)} placeholder="Your name" /></div>
          <div><label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 4, display: 'block' }}>How old are you?</label>
            <input className="input-field" type="number" value={userData.age} onChange={e => updateField('age', e.target.value)} placeholder="Age" /></div>
          <div><label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>Average cycle length: <strong style={{ color: phaseColor }}>{userData.cycleLength} days</strong></label>
            <input type="range" min="21" max="35" value={userData.cycleLength} onChange={e => updateField('cycleLength', +e.target.value)} /></div>
          <div><label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>Period duration: <strong style={{ color: phaseColor }}>{userData.periodDuration} days</strong></label>
            <input type="range" min="3" max="7" value={userData.periodDuration} onChange={e => updateField('periodDuration', +e.target.value)} /></div>
        </div>
      </div>,
      // Step 1: Last Period
      <div key="s1" className="fade-in-up">
        <div className="display-font" style={{ fontSize: 28, color: phaseColor, marginBottom: 4 }}>Your cycle</div>
        <p style={{ color: '#8B6B8D', marginBottom: 24, fontSize: 14 }}>This helps us calculate your current phase.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 4, display: 'block' }}>First day of your last period</label>
            <input className="input-field" type="date" value={userData.lastPeriodDate} onChange={e => updateField('lastPeriodDate', e.target.value)} /></div>
          <div><label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 8, display: 'block' }}>How regular are your periods?</label>
            {['Regular','Somewhat irregular','Irregular'].map(opt => (
              <div key={opt} className={`chip ${userData.regularity === opt.toLowerCase().replace(/ /g,'') ? 'selected' : ''}`}
                onClick={() => updateField('regularity', opt.toLowerCase().replace(/ /g,''))}>{opt}</div>
            ))}</div>
        </div>
      </div>,
      // Step 2: Diet
      <div key="s2" className="fade-in-up">
        <div className="display-font" style={{ fontSize: 28, color: phaseColor, marginBottom: 4 }}>Nutrition</div>
        <p style={{ color: '#8B6B8D', marginBottom: 20, fontSize: 14 }}>We'll tailor recipes just for you.</p>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>Dietary preferences</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {['No restrictions','Vegetarian','Vegan','Pescatarian','Keto','Paleo','Gluten-free','Dairy-free','Halal','Kosher'].map(d => (
            <div key={d} className={`chip ${userData.dietPreferences.includes(d) ? 'selected' : ''}`}
              onClick={() => toggleArrayItem('dietPreferences', d)}>{d}</div>
          ))}
        </div>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>Any allergies?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {['Nuts','Shellfish','Eggs','Soy','Gluten','Dairy'].map(a => (
            <div key={a} className={`chip ${userData.allergies.includes(a) ? 'selected' : ''}`}
              onClick={() => toggleArrayItem('allergies', a)}>{a}</div>
          ))}
        </div>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>Nutrition goals</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {['More energy','Better sleep','Reduce bloating','Reduce cramps','Hormone balance','Clearer skin'].map(g => (
            <div key={g} className={`chip ${userData.nutritionGoals.includes(g) ? 'selected' : ''}`}
              onClick={() => toggleArrayItem('nutritionGoals', g)}>{g}</div>
          ))}
        </div>
      </div>,
      // Step 3: Movement
      <div key="s3" className="fade-in-up">
        <div className="display-font" style={{ fontSize: 28, color: phaseColor, marginBottom: 4 }}>Movement</div>
        <p style={{ color: '#8B6B8D', marginBottom: 20, fontSize: 14 }}>What kinds of movement do you enjoy?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {['Yoga','Pilates','Strength training','HIIT','Running','Walking','Swimming','Dancing','Stretching','Cycling'].map(w => (
            <div key={w} className={`chip ${userData.workoutPreferences.includes(w) ? 'selected' : ''}`}
              onClick={() => toggleArrayItem('workoutPreferences', w)}>{w}</div>
          ))}
        </div>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>Fitness level</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['beginner','intermediate','advanced'].map(l => (
            <div key={l} className={`chip ${userData.fitnessLevel === l ? 'selected' : ''}`} style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => updateField('fitnessLevel', l)}>{l.charAt(0).toUpperCase() + l.slice(1)}</div>
          ))}
        </div>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 4, display: 'block' }}>Physical limitations? (optional)</label>
        <input className="input-field" value={userData.physicalLimitations} onChange={e => updateField('physicalLimitations', e.target.value)} placeholder="E.g., knee injury, lower back pain" />
      </div>,
      // Step 4: Mental Wellness
      <div key="s4" className="fade-in-up">
        <div className="display-font" style={{ fontSize: 28, color: phaseColor, marginBottom: 4 }}>Your mind</div>
        <p style={{ color: '#8B6B8D', marginBottom: 20, fontSize: 14 }}>Help us support your mental wellness.</p>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 6, display: 'block' }}>What helps you de-stress?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 20 }}>
          {['Meditation','Journaling','Deep breathing','Music','Nature','Reading','Affirmations','Talking to someone'].map(s => (
            <div key={s} className={`chip ${userData.stressRelief.includes(s) ? 'selected' : ''}`}
              onClick={() => toggleArrayItem('stressRelief', s)}>{s}</div>
          ))}
        </div>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 8, display: 'block' }}>Current stress level</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          {['😌','🙂','😐','😰','🤯'].map((e, i) => (
            <div key={i} onClick={() => updateField('stressLevel', i + 1)}
              style={{ fontSize: 32, cursor: 'pointer', opacity: userData.stressLevel === i + 1 ? 1 : 0.3, transition: 'all 0.2s',
                transform: userData.stressLevel === i + 1 ? 'scale(1.3)' : 'scale(1)' }}>{e}</div>
          ))}
        </div>
        <label style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 8, display: 'block' }}>Sleep quality</label>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['😴','😪','😐','😊','🌟'].map((e, i) => (
            <div key={i} onClick={() => updateField('sleepQuality', i + 1)}
              style={{ fontSize: 32, cursor: 'pointer', opacity: userData.sleepQuality === i + 1 ? 1 : 0.3, transition: 'all 0.2s',
                transform: userData.sleepQuality === i + 1 ? 'scale(1.3)' : 'scale(1)' }}>{e}</div>
          ))}
        </div>
      </div>,
      // Step 5: Confirmation
      <div key="s5" className="fade-in-up">
        <div className="display-font" style={{ fontSize: 28, color: phaseColor, marginBottom: 4 }}>You're all set!</div>
        <p style={{ color: '#8B6B8D', marginBottom: 20, fontSize: 14 }}>Here's what we know about you, {userData.name}.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['🗓️', 'Cycle', `${userData.cycleLength}-day cycle, ${userData.periodDuration}-day period`],
            ['🥗', 'Diet', userData.dietPreferences.join(', ') || 'No restrictions'],
            ['⚠️', 'Allergies', userData.allergies.join(', ') || 'None'],
            ['💪', 'Movement', userData.workoutPreferences.join(', ') || 'Not specified'],
            ['🧠', 'Stress relief', userData.stressRelief.join(', ') || 'Not specified']
          ].map(([emoji, label, value]) => (
            <div key={label} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 24 }}>{emoji}</div>
              <div><div style={{ fontSize: 12, color: '#8B6B8D' }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#2D1B2E' }}>{value}</div></div>
            </div>
          ))}
        </div>
      </div>
    ];

    return (
      <div className="rhythm-app" style={{ '--phase-color': phaseColor }}>
        <style>{css}</style>
        <div className="wave-header" style={{ height: 140 }}>
          <div className="wave-header-logo display-font">Rhythm</div>
        </div>
        <div style={{ padding: '20px 24px 40px' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= onboardStep ? phaseColor : '#e8d0d8', transition: 'background 0.3s' }} />
            ))}
          </div>
          {steps[onboardStep]}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            {onboardStep > 0 && <button className="btn-secondary" onClick={() => setOnboardStep(prev => prev - 1)}>Back</button>}
            <button className="btn-primary" style={{ marginLeft: 'auto' }}
              onClick={() => { if (onboardStep < 5) setOnboardStep(prev => prev + 1); else setScreen('home'); }}>
              {onboardStep === 5 ? 'Start Your Rhythm ✨' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN SCREENS WITH NAV
  // ═══════════════════════════════════════════════════════════

  function WaveHeader({ title }) {
    return (
      <div className="wave-header" style={{ background: `linear-gradient(135deg, ${phaseColor} 0%, ${PHASES[currentPhase]?.color || '#D4728C'} 60%, #FCE4EC 100%)` }}>
        <div className="wave-header-logo display-font">{title || 'Rhythm'}</div>
      </div>
    );
  }

  function NavBar() {
    const tabs = [
      { id: 'home', icon: '🏠', label: 'Home' },
      { id: 'cycle', icon: '🔄', label: 'Cycle' },
      { id: 'add', icon: '+', label: '' },
      { id: 'wellness', icon: '💗', label: 'Wellness' },
      { id: 'profile', icon: '👤', label: 'Profile' }
    ];
    return (
      <div className="bottom-nav">
        {tabs.map(t => t.id === 'add' ? (
          <button key="add" className="add-btn" onClick={() => setShowModal(true)}>+</button>
        ) : (
          <button key={t.id} className={screen === t.id ? 'active' : ''}
            onClick={() => { setScreen(t.id); setSelectedRecipe(null); setSelectedWorkout(null); }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    );
  }

  function QuickLogModal() {
    if (!showModal) return null;
    const [quickMood, setQuickMood] = useState(null);
    const [loggedPeriod, setLoggedPeriod] = useState(false);
    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="display-font" style={{ fontSize: 22, color: phaseColor, marginBottom: 16 }}>Quick Log</div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 8 }}>How are you feeling?</p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {['😊','🙂','😐','😢','😤'].map((e,i) => (
                <div key={i} onClick={() => setQuickMood(i)}
                  style={{ fontSize: 36, cursor: 'pointer', opacity: quickMood === i ? 1 : 0.3,
                    transform: quickMood === i ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.2s' }}>{e}</div>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginBottom: 10 }}
            onClick={() => {
              if (quickMood !== null) {
                const moods = ['Great','Good','Okay','Sad','Frustrated'];
                setUserData(prev => ({ ...prev, moodLog: [{ mood: moods[quickMood], date: new Date().toISOString(), phase: currentPhase }, ...prev.moodLog] }));
              }
              setShowModal(false);
            }}>Log Mood</button>
          {!loggedPeriod ? (
            <button className="btn-secondary" style={{ width: '100%' }}
              onClick={() => { updateField('lastPeriodDate', new Date().toISOString().split('T')[0]); setLoggedPeriod(true); }}>
              🩸 Period started today
            </button>
          ) : <p style={{ textAlign: 'center', color: phaseColor, fontWeight: 600, fontSize: 14 }}>✓ Period logged!</p>}
        </div>
      </div>
    );
  }

  // ─── PHASE DETAIL (Do's & Don'ts Guide) ───
  if (selectedPhaseDetail) {
    const pd = PHASES[selectedPhaseDetail];
    const pc = pd.color;
    const doItems = [
      ...pd.nutrition.focus.map(f => ({ icon: '🥗', text: f, category: 'Nutrition' })),
      ...pd.movement.recommended.map(m => ({ icon: '🏃‍♀️', text: m, category: 'Movement' })),
      ...pd.mentalWellness.focus.map(m => ({ icon: '🧠', text: m, category: 'Wellness' })),
      ...pd.bodyTips.map(t => ({ icon: '💡', text: t, category: 'Body Care' }))
    ];
    const dontItems = [
      ...pd.nutrition.avoid.map(f => ({ icon: '🚫', text: f, category: 'Nutrition' })),
      ...(pd.movement.avoid || []).map(m => ({ icon: '⛔', text: m, category: 'Movement' }))
    ];
    return (
      <div className="rhythm-app" style={{ '--phase-color': pc }}>
        <style>{css}</style>
        <WaveHeader />
        <div className="screen-content fade-in-up">
          <button onClick={() => setSelectedPhaseDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: pc, fontWeight: 600, fontSize: 14, marginBottom: 16, marginTop: 8 }}>← Back to Cycle</button>

          {/* Phase header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{pd.emoji}</div>
            <div className="display-font" style={{ fontSize: 28, color: pc, marginBottom: 6 }}>{pd.name}</div>
            <div style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 8 }}>Days {pd.dayRange[0]}–{pd.dayRange[1]}</div>
            <p style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>{pd.description}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              <span style={{ background: `${pc}15`, color: pc, padding: '4px 14px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>⚡ {pd.energy} energy</span>
              <span style={{ background: '#FCE4EC', color: '#8B6B8D', padding: '4px 14px', borderRadius: 12, fontSize: 12 }}>💭 {pd.mood}</span>
            </div>
          </div>

          {/* What's happening in your body */}
          <div className="card card-pink" style={{ marginBottom: 20, padding: 20 }}>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 8, fontSize: 15 }}>🔬 What's Happening In Your Body</div>
            <p style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.6 }}>{pd.bodyInfo}</p>
          </div>

          {/* Common Symptoms */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10, fontSize: 15 }}>🩺 Common Symptoms</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {pd.symptoms.map(s => (
                <span key={s} style={{ background: '#FCE4EC', color: '#2D1B2E', padding: '6px 14px', borderRadius: 16, fontSize: 13 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* ✅ WHAT TO DO */}
          <div style={{ marginBottom: 24 }}>
            <div className="display-font" style={{ fontSize: 22, color: pc, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: `${pc}15`, width: 36, height: 36, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</span>
              What To Do
            </div>

            {/* Group by category */}
            {['Nutrition', 'Movement', 'Wellness', 'Body Care'].map(cat => {
              const items = doItems.filter(d => d.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: pc, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{items[0].icon} {cat}</div>
                  {items.map((item, i) => (
                    <div key={i} className="card" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: '#2D1B2E' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Key nutrients */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: pc, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>💊 Key Nutrients To Prioritize</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {pd.nutrition.nutrients.map(n => (
                  <span key={n} style={{ background: `${pc}12`, color: pc, padding: '6px 14px', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>{n}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 🚫 WHAT NOT TO DO */}
          {dontItems.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div className="display-font" style={{ fontSize: 22, color: '#B2002D', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#B2002D15', width: 36, height: 36, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚫</span>
                What Not To Do
              </div>
              {['Nutrition', 'Movement'].map(cat => {
                const items = dontItems.filter(d => d.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B2002D', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{cat === 'Nutrition' ? '🚫' : '⛔'} {cat}</div>
                    {items.map((item, i) => (
                      <div key={i} className="card" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#FFF5F5', border: '1px solid #FECDD3' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B2002D', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: '#2D1B2E' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommended Movement */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10, fontSize: 15 }}>🏋️‍♀️ Movement Intensity: <span style={{ color: pc }}>{pd.movement.intensity}</span></div>
          </div>

          {/* Journal Prompts for the phase */}
          <div className="card card-pink" style={{ marginBottom: 20, padding: 20 }}>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 12, fontSize: 15 }}>📝 Reflect During This Phase</div>
            {pd.mentalWellness.journalPrompts.map((p, i) => (
              <p key={i} style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic' }}>"{p}"</p>
            ))}
          </div>

          {/* Affirmations */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10, fontSize: 15 }}>💜 Affirmations For You</div>
            {pd.mentalWellness.affirmations.map((a, i) => (
              <div key={i} className="card" style={{ marginBottom: 6, textAlign: 'center', padding: '14px 16px' }}>
                <span className="display-font" style={{ fontSize: 15, color: pc }}>"{a}"</span>
              </div>
            ))}
          </div>

          {/* Day-by-Day Plan */}
          {(() => {
            const phaseName = selectedPhaseDetail;
            const { recipes, workouts, meditations } = getDailyItemsForPhase(phaseName);
            const range = pd.dayRange;
            const numDays = range[1] - range[0] + 1;
            return (
              <div style={{ marginBottom: 24 }}>
                <div className="display-font" style={{ fontSize: 22, color: pc, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: `${pc}15`, width: 36, height: 36, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📅</span>
                  Day-by-Day Plan
                </div>
                <p style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 16 }}>Your daily recipe, workout & meditation for every day of this phase</p>
                {Array.from({ length: numDays }, (_, i) => {
                  const d = i + 1;
                  const isToday = phaseName === currentPhase && d === dayInPhase;
                  const recipe = getDailyItem(recipes, d);
                  const workout = getDailyItem(workouts, d);
                  const meditation = getDailyItem(meditations, d);
                  const tip = getDailyItem(pd.bodyTips, d);
                  const nutrient = getDailyItem(pd.nutrition.focus, d);
                  const journalPrompt = getDailyItem(pd.mentalWellness.journalPrompts, d);
                  const affirmation = getDailyItem(pd.mentalWellness.affirmations, d);
                  return (
                    <div key={d} style={{ marginBottom: 14, border: isToday ? `2px solid ${pc}` : '1.5px solid #e8d0d8', borderRadius: 16, overflow: 'hidden', background: isToday ? `${pc}06` : 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: isToday ? `${pc}12` : '#FCE4EC' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: isToday ? pc : '#2D1B2E' }}>Day {d}</span>
                          <span style={{ fontSize: 12, color: '#8B6B8D' }}>(Cycle Day {range[0] + i})</span>
                        </div>
                        {isToday && <span style={{ background: pc, color: 'white', padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>Today</span>}
                      </div>
                      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {recipe && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                            onClick={() => setSelectedRecipe(recipe)}>
                            <span style={{ fontSize: 18 }}>🍽️</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, color: pc, fontWeight: 700 }}>RECIPE</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#2D1B2E' }}>{recipe.name}</div>
                              <div style={{ fontSize: 11, color: '#8B6B8D' }}>⏱ {recipe.prepTime} min</div>
                            </div>
                            <span style={{ color: pc, fontSize: 16 }}>›</span>
                          </div>
                        )}
                        {workout && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                            onClick={() => setSelectedWorkout(workout)}>
                            <span style={{ fontSize: 18 }}>🏋️‍♀️</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, color: pc, fontWeight: 700 }}>WORKOUT</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#2D1B2E' }}>{workout.name}</div>
                              <div style={{ fontSize: 11, color: '#8B6B8D' }}>{workout.duration} min · {workout.intensity}</div>
                            </div>
                            <span style={{ color: pc, fontSize: 16 }}>›</span>
                          </div>
                        )}
                        {meditation && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                            onClick={() => { setSelectedPhaseDetail(null); setScreen('meditate'); setMeditationTime(meditation.duration * 60); setMeditationRemaining(meditation.duration * 60); }}>
                            <span style={{ fontSize: 18 }}>🧘‍♀️</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, color: pc, fontWeight: 700 }}>MEDITATION</div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#2D1B2E' }}>{meditation.name}</div>
                              <div style={{ fontSize: 11, color: '#8B6B8D' }}>{meditation.duration} min</div>
                            </div>
                            <span style={{ color: pc, fontSize: 16 }}>›</span>
                          </div>
                        )}
                        {nutrient && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>🥗</span>
                            <div><div style={{ fontSize: 11, color: pc, fontWeight: 700 }}>NUTRITION FOCUS</div><div style={{ fontSize: 13, color: '#2D1B2E' }}>{nutrient}</div></div>
                          </div>
                        )}
                        {tip && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>💡</span>
                            <div><div style={{ fontSize: 11, color: pc, fontWeight: 700 }}>BODY TIP</div><div style={{ fontSize: 13, color: '#2D1B2E' }}>{tip}</div></div>
                          </div>
                        )}
                        {journalPrompt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>📝</span>
                            <div><div style={{ fontSize: 11, color: pc, fontWeight: 700 }}>JOURNAL</div><div style={{ fontSize: 13, color: '#2D1B2E', fontStyle: 'italic' }}>"{journalPrompt}"</div></div>
                          </div>
                        )}
                        {affirmation && (
                          <div style={{ background: '#FCE4EC', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
                            <span style={{ fontSize: 13, color: '#2D1B2E', fontStyle: 'italic' }}>✨ "{affirmation}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
        <NavBar />
      </div>
    );
  }

  // ─── RECIPE DETAIL ───
  if (selectedRecipe) {
    const r = selectedRecipe;
    return (
      <div className="rhythm-app" style={{ '--phase-color': phaseColor }}>
        <style>{css}</style>
        <WaveHeader title="Recipes" />
        <div className="screen-content fade-in-up">
          <button onClick={() => setSelectedRecipe(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: phaseColor, fontWeight: 600, fontSize: 14, marginBottom: 16, marginTop: 8 }}>← Back</button>
          <div className="display-font" style={{ fontSize: 26, color: '#2D1B2E', marginBottom: 8 }}>{r.name}</div>
          <p style={{ color: '#8B6B8D', fontSize: 14, marginBottom: 16 }}>{r.description}</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ background: '#FCE4EC', color: phaseColor, padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>⏱ {r.prepTime} min</span>
            {r.dietTags.map(t => <span key={t} style={{ background: '#F5F5F5', color: '#8B6B8D', padding: '4px 12px', borderRadius: 12, fontSize: 12 }}>{t}</span>)}
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#2D1B2E' }}>Ingredients</h3>
            {r.ingredients.map((ing, i) => <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid #f0e0e5', fontSize: 14, color: '#2D1B2E', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: phaseColor, flexShrink: 0 }} />{ing}</div>)}
          </div>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#2D1B2E' }}>Steps</h3>
            {r.steps.map((step, i) => <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0e0e5', fontSize: 14, color: '#2D1B2E', display: 'flex', gap: 10 }}>
              <span style={{ color: phaseColor, fontWeight: 800, fontSize: 16, minWidth: 20 }}>{i + 1}</span>{step}</div>)}
          </div>
        </div>
        <NavBar />
        <QuickLogModal />
      </div>
    );
  }

  // ─── WORKOUT DETAIL ───
  if (selectedWorkout) {
    const w = selectedWorkout;
    const wPhase = PHASES[w.phase] || phaseData;
    const wColor = wPhase.color;
    return (
      <div className="rhythm-app" style={{ '--phase-color': wColor }}>
        <style>{css}</style>
        <WaveHeader title="Movement" />
        <div className="screen-content fade-in-up">
          <button onClick={() => setSelectedWorkout(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: wColor, fontWeight: 600, fontSize: 14, marginBottom: 16, marginTop: 8 }}>← Back</button>
          <div className="display-font" style={{ fontSize: 26, color: '#2D1B2E', marginBottom: 8 }}>{w.name}</div>
          <p style={{ color: '#8B6B8D', fontSize: 14, marginBottom: 16 }}>{w.description}</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ background: '#FCE4EC', color: wColor, padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>⏱ {w.duration} min</span>
            <span style={{ background: '#FCE4EC', color: wColor, padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
              {w.intensity === 'low' ? '🟢' : w.intensity === 'medium' ? '🟡' : '🔴'} {w.intensity}</span>
            <span style={{ background: '#F5F5F5', color: '#8B6B8D', padding: '4px 12px', borderRadius: 12, fontSize: 12 }}>{w.type}</span>
            {w.muscleGroups && w.muscleGroups.map(mg => (
              <span key={mg} style={{ background: `${wColor}10`, color: wColor, padding: '4px 12px', borderRadius: 12, fontSize: 12 }}>{mg}</span>
            ))}
          </div>

          {/* Warmup */}
          {w.warmup && (
            <div className="card" style={{ marginBottom: 12, borderLeft: `4px solid #66BB6A`, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#2E7D32', marginBottom: 4 }}>🟢 WARM-UP</div>
              <p style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.5 }}>{w.warmup}</p>
            </div>
          )}

          {/* Exercise List */}
          {w.exercises && w.exercises.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="display-font" style={{ fontSize: 18, color: wColor, marginBottom: 12 }}>Exercises</div>
              {w.exercises.map((ex, i) => (
                <div key={i} style={{ marginBottom: 10, background: '#FDF0F3', borderRadius: 14, padding: '14px 16px', border: '1px solid #f0e0e5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: wColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#2D1B2E' }}>{ex.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6, marginLeft: 38 }}>
                    {ex.sets && <span style={{ background: `${wColor}15`, color: wColor, padding: '2px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{ex.sets} {ex.sets === 1 ? 'set' : 'sets'}</span>}
                    {ex.reps && <span style={{ background: `${wColor}15`, color: wColor, padding: '2px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{ex.reps}</span>}
                    {ex.hold && <span style={{ background: '#FFF3E0', color: '#E65100', padding: '2px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Hold {ex.hold}</span>}
                  </div>
                  {ex.notes && <p style={{ fontSize: 13, color: '#8B6B8D', lineHeight: 1.4, marginLeft: 38 }}>{ex.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Cooldown */}
          {w.cooldown && (
            <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #42A5F5', padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1565C0', marginBottom: 4 }}>🔵 COOL-DOWN</div>
              <p style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.5 }}>{w.cooldown}</p>
            </div>
          )}

          {/* Muscles to focus on */}
          {wPhase.movement.muscleFocus && wPhase.movement.muscleFocus.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E', marginBottom: 10 }}>✅ Best Muscles to Target — {wPhase.name}</div>
              {wPhase.movement.muscleFocus.map((m, i) => (
                <div key={i} className="card" style={{ marginBottom: 8, padding: '12px 14px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: wColor, marginBottom: 2 }}>{m.muscle}</div>
                  <p style={{ fontSize: 12, color: '#8B6B8D', lineHeight: 1.4 }}>{m.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Muscles to avoid */}
          {wPhase.movement.muscleAvoid && wPhase.movement.muscleAvoid.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#B2002D', marginBottom: 10 }}>🚫 Muscles / Movements to Avoid — {wPhase.name}</div>
              {wPhase.movement.muscleAvoid.map((m, i) => (
                <div key={i} style={{ marginBottom: 8, background: '#FFF5F5', borderRadius: 14, padding: '12px 14px', border: '1px solid #FECDD3' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#B2002D', marginBottom: 2 }}>{m.muscle}</div>
                  <p style={{ fontSize: 12, color: '#8B6B8D', lineHeight: 1.4 }}>{m.reason}</p>
                </div>
              ))}
            </div>
          )}

          <div className="card card-pink" style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ color: '#8B6B8D', fontSize: 13, lineHeight: 1.5 }}>Listen to your body and modify as needed. During your {wPhase.name.toLowerCase()}, your energy is <strong style={{ color: wColor }}>{wPhase.energy.toLowerCase()}</strong>. Adjust intensity to match how you feel today.</p>
          </div>
        </div>
        <NavBar />
        <QuickLogModal />
      </div>
    );
  }

  // ─── SCREEN CONTENT ───
  let screenContent;

  // HOME
  if (screen === 'home') {
    screenContent = (
      <div className="screen-content">
        <div style={{ marginTop: 8, marginBottom: 20 }} className="fade-in-up">
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2D1B2E' }}>{getGreeting()}, {userData.name} ✨</h1>
          <p style={{ color: '#8B6B8D', fontSize: 14 }}>Here's your rhythm today</p>
        </div>
        {/* Phase Card */}
        <div className="card fade-in-up stagger-1" style={{ background: `linear-gradient(135deg, ${phaseColor}15, ${phaseColor}08)`, border: `1px solid ${phaseColor}20`, marginBottom: 20, cursor: 'pointer' }}
          onClick={() => setSelectedPhaseDetail(currentPhase)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <svg width="130" height="130" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="65" fill="none" stroke="#e8d0d8" strokeWidth="8" />
                <circle cx="75" cy="75" r="65" fill="none" stroke={phaseColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 75 75)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 28 }}>{phaseData.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: phaseColor }}>Day {cycleDay}</div>
                <div style={{ fontSize: 10, color: '#8B6B8D' }}>of {totalDays}</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="display-font" style={{ fontSize: 18, color: phaseColor, marginBottom: 4 }}>{phaseData.name}</div>
              <p style={{ fontSize: 13, color: '#2D1B2E', lineHeight: 1.5, marginBottom: 8 }}>{phaseData.description}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ background: `${phaseColor}20`, color: phaseColor, padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>⚡ {phaseData.energy}</span>
                <span style={{ background: '#FCE4EC', color: '#8B6B8D', padding: '2px 8px', borderRadius: 8, fontSize: 11 }}>💭 {phaseData.mood.split(',')[0]}</span>
              </div>
              <div style={{ fontSize: 12, color: phaseColor, marginTop: 8, fontWeight: 600 }}>Tap to learn what to do & avoid →</div>
            </div>
          </div>
        </div>
        {/* Today's Focus */}
        <div className="display-font fade-in-up stagger-2" style={{ fontSize: 20, color: phaseColor, marginBottom: 12 }}>Today's Focus</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }} className="fade-in-up stagger-3">
          {[
            { icon: '🥗', label: 'Nutrition', desc: todayNutritionFocus || phaseData.nutrition.focus[0], screen: 'nutrition' },
            { icon: '🏋️‍♀️', label: 'Movement', desc: todayWorkout ? todayWorkout.name : phaseData.movement.recommended[0], screen: 'movement' },
            { icon: '🧠', label: 'Mind', desc: todayJournalPrompt ? todayJournalPrompt.split('?')[0] + '?' : phaseData.mentalWellness.focus[0], screen: 'wellness' }
          ].map(f => (
            <div key={f.label} className="card" style={{ flex: 1, textAlign: 'center', padding: 14, cursor: 'pointer' }}
              onClick={() => { setScreen(f.screen); if (f.screen === 'wellness') setWellnessTab('mind'); }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2D1B2E', marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: 10, color: '#8B6B8D', lineHeight: 1.3 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        {/* Daily Affirmation */}
        <div className="card card-pink fade-in-up stagger-4" style={{ marginBottom: 20, textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 12, color: '#8B6B8D', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Today's Affirmation</div>
          <div className="display-font" style={{ fontSize: 18, color: '#2D1B2E', lineHeight: 1.4 }}>
            "{phaseData.mentalWellness.affirmations[cycleDay % phaseData.mentalWellness.affirmations.length]}"
          </div>
        </div>
        {/* Today's Picks — daily rotating suggestions */}
        <div className="display-font fade-in-up stagger-5" style={{ fontSize: 20, color: phaseColor, marginBottom: 4 }}>Today's Picks</div>
        <p style={{ color: '#8B6B8D', fontSize: 12, marginBottom: 14 }} className="fade-in-up stagger-5">Day {dayInPhase} of your {phaseData.name.toLowerCase()}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }} className="fade-in-up stagger-5">
          {todayRecipe && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onClick={() => { setSelectedRecipe(todayRecipe); }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${phaseColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🍽️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: phaseColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recipe of the Day</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E' }}>{todayRecipe.name}</div>
                <div style={{ fontSize: 12, color: '#8B6B8D' }}>⏱ {todayRecipe.prepTime} min · {todayRecipe.nutrients.slice(0, 2).join(', ')}</div>
              </div>
              <span style={{ color: phaseColor, fontSize: 18 }}>›</span>
            </div>
          )}
          {todayWorkout && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onClick={() => { setSelectedWorkout(todayWorkout); }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${phaseColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🏋️‍♀️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: phaseColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Workout of the Day</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E' }}>{todayWorkout.name}</div>
                <div style={{ fontSize: 12, color: '#8B6B8D' }}>{todayWorkout.duration} min · {todayWorkout.intensity} intensity</div>
              </div>
              <span style={{ color: phaseColor, fontSize: 18 }}>›</span>
            </div>
          )}
          {todayMeditation && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onClick={() => { setScreen('meditate'); setMeditationTime(todayMeditation.duration * 60); setMeditationRemaining(todayMeditation.duration * 60); }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${phaseColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🧘‍♀️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: phaseColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Meditation of the Day</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E' }}>{todayMeditation.name}</div>
                <div style={{ fontSize: 12, color: '#8B6B8D' }}>{todayMeditation.duration} min · {todayMeditation.category}</div>
              </div>
              <span style={{ color: phaseColor, fontSize: 18 }}>›</span>
            </div>
          )}
          {todayTip && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${phaseColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>💡</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: phaseColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tip of the Day</div>
                <div style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.4 }}>{todayTip}</div>
              </div>
            </div>
          )}
        </div>
        {/* Quick Access */}
        <div className="display-font fade-in-up stagger-5" style={{ fontSize: 20, color: phaseColor, marginBottom: 12 }}>Explore</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: '🧘‍♀️', label: 'Meditate', s: 'meditate' },
            { icon: '📖', label: 'Journal', s: 'journal' },
            { icon: '🍳', label: 'Recipes', s: 'recipes' },
            { icon: '🏃‍♀️', label: 'Movement', s: 'movement' },
            { icon: '💜', label: 'Body', s: 'body' },
            { icon: '🎧', label: 'Listen', s: 'listen' }
          ].map(item => (
            <div key={item.label} className="card" style={{ textAlign: 'center', padding: 16, cursor: 'pointer' }}
              onClick={() => setScreen(item.s)}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#2D1B2E' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CYCLE
  else if (screen === 'cycle') {
    const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    screenContent = (
      <div className="screen-content">
        <div className="display-font fade-in-up" style={{ fontSize: 24, color: phaseColor, marginTop: 8, marginBottom: 20 }}>Your Cycle</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }} className="fade-in-up stagger-1">
          <div style={{ position: 'relative' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#e8d0d8" strokeWidth="10" />
              {phases.map((p, i) => {
                const pd = PHASES[p];
                const start = pd.dayRange[0] / totalDays;
                const end = pd.dayRange[1] / totalDays;
                const len = end - start;
                return <circle key={p} cx="100" cy="100" r="85" fill="none" stroke={pd.color} strokeWidth="10"
                  strokeDasharray={`${len * 2 * Math.PI * 85} ${(1 - len) * 2 * Math.PI * 85}`}
                  strokeDashoffset={-(start * 2 * Math.PI * 85)} transform="rotate(-90 100 100)" opacity={p === currentPhase ? 1 : 0.4} />;
              })}
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{phaseData.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: phaseColor }}>Day {cycleDay}</div>
            </div>
          </div>
        </div>
        {phases.map((p, i) => (
          <div key={p} className={`card fade-in-up stagger-${i + 2}`} style={{ marginBottom: 10, border: p === currentPhase ? `2px solid ${PHASES[p].color}` : '2px solid transparent', cursor: 'pointer' }}
            onClick={() => setSelectedPhaseDetail(p)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 24 }}>{PHASES[p].emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: p === currentPhase ? PHASES[p].color : '#2D1B2E' }}>{PHASES[p].name}</div>
                <div style={{ fontSize: 12, color: '#8B6B8D' }}>Days {PHASES[p].dayRange[0]}–{PHASES[p].dayRange[1]} · {PHASES[p].energy} energy</div>
              </div>
              {p === currentPhase && <span style={{ background: PHASES[p].color, color: 'white', padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>Current</span>}
              <span style={{ color: PHASES[p].color, fontSize: 18 }}>›</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // WELLNESS (Mind / Body / Soul tabs)
  else if (screen === 'wellness') {
    screenContent = (
      <div className="screen-content">
        <div style={{ display: 'flex', gap: 0, marginTop: 8, marginBottom: 20, background: '#FCE4EC', borderRadius: 25, padding: 3 }}>
          {['mind', 'body', 'soul'].map(t => (
            <button key={t} onClick={() => setWellnessTab(t)}
              style={{ flex: 1, padding: '10px 0', borderRadius: 22, border: 'none', cursor: 'pointer',
                background: wellnessTab === t ? phaseColor : 'transparent', color: wellnessTab === t ? 'white' : '#8B6B8D',
                fontWeight: 600, fontSize: 14, fontFamily: "'Fraunces', serif", fontStyle: 'italic', transition: 'all 0.3s' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {wellnessTab === 'mind' && (
          <div className="fade-in-up">
            <div className="display-font" style={{ fontSize: 32, color: phaseColor, marginBottom: 16 }}>Mind</div>
            <div className="card card-pink" style={{ marginBottom: 16, textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 11, color: '#8B6B8D', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Daily Affirmation</div>
              <div className="display-font" style={{ fontSize: 18, color: '#2D1B2E', lineHeight: 1.4 }}>
                "{phaseData.mentalWellness.affirmations[0]}"
              </div>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 8 }}>💭 Journal Prompt</div>
              <p style={{ color: '#8B6B8D', fontSize: 14, fontStyle: 'italic' }}>
                "{phaseData.mentalWellness.journalPrompts[cycleDay % phaseData.mentalWellness.journalPrompts.length]}"
              </p>
              <button className="btn-secondary" style={{ marginTop: 12, fontSize: 12 }} onClick={() => setScreen('journal')}>Open Journal →</button>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10 }}>How are you feeling?</div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {['😊', '🙂', '😐', '😢', '😤'].map((e, i) => (
                  <div key={i} style={{ fontSize: 32, cursor: 'pointer', opacity: todayMood === i ? 1 : 0.3, transition: 'all 0.2s',
                    transform: todayMood === i ? 'scale(1.2)' : 'scale(1)' }} onClick={() => setTodayMood(i)}>{e}</div>
                ))}
              </div>
            </div>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10 }}>Focus areas for your phase</div>
            {phaseData.mentalWellness.focus.map(f => (
              <div key={f} className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
                <span style={{ fontSize: 14, color: '#2D1B2E' }}>{f}</span>
              </div>
            ))}
          </div>
        )}
        {wellnessTab === 'body' && (
          <div className="fade-in-up">
            <div className="display-font" style={{ fontSize: 32, color: phaseColor, marginBottom: 16 }}>Body</div>
            <div className="card card-pink" style={{ marginBottom: 16, padding: 20 }}>
              <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 8 }}>🔬 What's happening in your body</div>
              <p style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.6 }}>{phaseData.bodyInfo}</p>
            </div>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10 }}>Common symptoms</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {phaseData.symptoms.map(s => (
                <span key={s} style={{ background: '#FCE4EC', color: '#2D1B2E', padding: '6px 14px', borderRadius: 16, fontSize: 13 }}>{s}</span>
              ))}
            </div>
            <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 10 }}>Tips for your body</div>
            {phaseData.bodyTips.map((tip, i) => (
              <div key={i} className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${phaseColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: phaseColor, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: '#2D1B2E' }}>{tip}</span>
              </div>
            ))}
            <div className="card" style={{ marginTop: 16, textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💧</div>
              <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 4 }}>Hydration Reminder</div>
              <p style={{ fontSize: 13, color: '#8B6B8D' }}>Aim for 8-10 glasses of water today. Hydration helps reduce bloating and fatigue.</p>
            </div>
          </div>
        )}
        {wellnessTab === 'soul' && (
          <div className="fade-in-up">
            <div className="display-font" style={{ fontSize: 32, color: phaseColor, marginBottom: 16 }}>Soul</div>
            <div className="card card-pink" style={{ marginBottom: 16, textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 11, color: '#8B6B8D', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Affirmation Carousel</div>
              {phaseData.mentalWellness.affirmations.map((a, i) => (
                <div key={i} className="display-font" style={{ fontSize: 16, color: '#2D1B2E', lineHeight: 1.4, marginBottom: 8, padding: '8px 0', borderBottom: i < phaseData.mentalWellness.affirmations.length - 1 ? '1px solid #e8d0d8' : 'none' }}>"{a}"</div>
              ))}
            </div>
            <div className="card" style={{ marginBottom: 16, textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 11, color: '#8B6B8D', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Breathing Exercise</div>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌬️</div>
              <p style={{ fontSize: 14, color: '#2D1B2E', marginBottom: 12 }}>4-7-8 Breathing: Inhale 4s, hold 7s, exhale 8s</p>
              <button className="btn-primary" onClick={() => { setScreen('meditate'); setMeditationTime(300); setMeditationRemaining(300); }}>Start Breathing →</button>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, color: '#2D1B2E', marginBottom: 8 }}>🙏 Gratitude Prompt</div>
              <p style={{ fontSize: 14, color: '#8B6B8D', fontStyle: 'italic' }}>Name 3 things your body did for you today that you're grateful for.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // NUTRITION
  else if (screen === 'nutrition') {
    screenContent = (
      <div className="screen-content">
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 16 }}>Nutrition</div>
        <p style={{ color: '#8B6B8D', fontSize: 14, marginBottom: 20 }} className="fade-in-up">Personalized for your {phaseData.name.toLowerCase()}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }} className="fade-in-up stagger-1">
          <div className="card" style={{ borderLeft: `4px solid ${phaseColor}` }}>
            <div style={{ fontSize: 12, color: phaseColor, fontWeight: 700, marginBottom: 8 }}>✅ EAT MORE</div>
            {phaseData.nutrition.focus.slice(0, 4).map(f => <div key={f} style={{ fontSize: 12, color: '#2D1B2E', marginBottom: 4 }}>• {f}</div>)}
          </div>
          <div className="card" style={{ borderLeft: '4px solid #e8d0d8' }}>
            <div style={{ fontSize: 12, color: '#B2002D', fontWeight: 700, marginBottom: 8 }}>⛔ EAT LESS</div>
            {phaseData.nutrition.avoid.slice(0, 4).map(f => <div key={f} style={{ fontSize: 12, color: '#2D1B2E', marginBottom: 4 }}>• {f}</div>)}
          </div>
        </div>
        <div className="display-font fade-in-up stagger-2" style={{ fontSize: 18, color: phaseColor, marginBottom: 10 }}>Key Nutrients</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }} className="fade-in-up stagger-2">
          {phaseData.nutrition.nutrients.map(n => (
            <span key={n} style={{ background: `${phaseColor}12`, color: phaseColor, padding: '6px 14px', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>{n}</span>
          ))}
        </div>
        <button className="btn-primary" style={{ width: '100%' }} onClick={() => setScreen('recipes')}>
          Browse Phase Recipes →
        </button>
      </div>
    );
  }

  // RECIPES
  else if (screen === 'recipes') {
    screenContent = (
      <div className="screen-content" style={{ position: 'relative' }}>
        <div className="watermark display-font" style={{ top: 0, left: -10 }}>Recipes</div>
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 4, position: 'relative', zIndex: 1 }}>Recipes</div>
        <p style={{ color: '#8B6B8D', fontSize: 14, marginBottom: 20, position: 'relative', zIndex: 1 }} className="fade-in-up">
          {userData.dietPreferences.length > 0 ? `Filtered for: ${userData.dietPreferences.join(', ')}` : 'All recipes for your phase'}
          {userData.allergies.length > 0 ? ` · No ${userData.allergies.join(', ').toLowerCase()}` : ''}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative', zIndex: 1 }}>
          {recipesToShow.map((r, i) => (
            <div key={r.id} className={`card fade-in-up stagger-${Math.min(i + 1, 5)}`} style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
              onClick={() => setSelectedRecipe(r)}>
              <div style={{ background: `linear-gradient(135deg, ${phaseColor}20, ${phaseColor}08)`, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 40 }}>{r.phase === 'menstrual' ? '🍲' : r.phase === 'follicular' ? '🥗' : r.phase === 'ovulatory' ? '🥙' : '🍠'}</span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#2D1B2E', marginBottom: 4 }}>{r.name}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#8B6B8D' }}>⏱ {r.prepTime}m</span>
                  {r.dietTags.slice(0, 2).map(t => <span key={t} style={{ fontSize: 10, color: phaseColor, background: '#FCE4EC', padding: '1px 6px', borderRadius: 6 }}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        {recipesToShow.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 32, marginTop: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <p style={{ color: '#8B6B8D' }}>No recipes match your current filters. Try adjusting your dietary preferences in your profile.</p>
          </div>
        )}
      </div>
    );
  }

  // MOVEMENT
  else if (screen === 'movement') {
    screenContent = (
      <div className="screen-content" style={{ position: 'relative' }}>
        <div className="watermark display-font" style={{ top: -10, right: -20, fontSize: 52 }}>Movement</div>
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 4, position: 'relative', zIndex: 1 }}>On-Demand Workouts</div>
        <p style={{ color: '#8B6B8D', fontSize: 14, marginBottom: 20, position: 'relative', zIndex: 1 }} className="fade-in-up">
          {userData.workoutPreferences.length > 0 ? `Since you love ${userData.workoutPreferences.slice(0, 3).join(', ').toLowerCase()}...` : `Perfect for your ${phaseData.name.toLowerCase()}`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative', zIndex: 1 }}>
          {workoutsToShow.map((w, i) => (
            <div key={w.id} className={`card fade-in-up stagger-${Math.min(i + 1, 5)}`} style={{ cursor: 'pointer' }}
              onClick={() => setSelectedWorkout(w)}>
              <div style={{ fontSize: 36, marginBottom: 8, textAlign: 'center' }}>
                {w.type === 'yoga' ? '🧘‍♀️' : w.type === 'running' ? '🏃‍♀️' : w.type === 'walking' ? '🚶‍♀️' : w.type === 'dancing' ? '💃' : w.type === 'swimming' ? '🏊‍♀️' : w.type === 'pilates' ? '🤸‍♀️' : w.type === 'hiit' ? '🔥' : '💪'}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#2D1B2E', marginBottom: 4 }}>{w.name}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#8B6B8D' }}>⏱ {w.duration}m</span>
                <span style={{ fontSize: 10, color: 'white', background: w.intensity === 'low' ? '#66BB6A' : w.intensity === 'medium' ? '#FFA726' : '#EF5350', padding: '1px 6px', borderRadius: 6 }}>{w.intensity}</span>
              </div>
            </div>
          ))}
        </div>
        {phaseData.movement.avoid.length > 0 && (
          <div className="card fade-in-up stagger-5" style={{ marginTop: 16, background: '#FFF8F0', borderLeft: '4px solid #FFA726' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#E65100', marginBottom: 4 }}>⚠️ Take it easy with</div>
            {phaseData.movement.avoid.map(a => <div key={a} style={{ fontSize: 12, color: '#2D1B2E' }}>• {a}</div>)}
          </div>
        )}
        {/* Muscle Focus */}
        {phaseData.movement.muscleFocus && phaseData.movement.muscleFocus.length > 0 && (
          <div style={{ marginTop: 16 }} className="fade-in-up stagger-5">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E', marginBottom: 10 }}>✅ Best muscles to target right now</div>
            {phaseData.movement.muscleFocus.map((m, i) => (
              <div key={i} className="card" style={{ marginBottom: 8, padding: '12px 14px' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: phaseColor, marginBottom: 2 }}>{m.muscle}</div>
                <p style={{ fontSize: 12, color: '#8B6B8D', lineHeight: 1.4 }}>{m.reason}</p>
              </div>
            ))}
          </div>
        )}
        {/* Muscle Avoid */}
        {phaseData.movement.muscleAvoid && phaseData.movement.muscleAvoid.length > 0 && (
          <div style={{ marginTop: 16 }} className="fade-in-up stagger-5">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#B2002D', marginBottom: 10 }}>🚫 Muscles / movements to avoid</div>
            {phaseData.movement.muscleAvoid.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, background: '#FFF5F5', borderRadius: 14, padding: '12px 14px', border: '1px solid #FECDD3' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#B2002D', marginBottom: 2 }}>{m.muscle}</div>
                <p style={{ fontSize: 12, color: '#8B6B8D', lineHeight: 1.4 }}>{m.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // JOURNAL
  else if (screen === 'journal') {
    const prompt = phaseData.mentalWellness.journalPrompts[cycleDay % phaseData.mentalWellness.journalPrompts.length];
    screenContent = (
      <div className="screen-content">
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 16 }}>Journal</div>
        <div className="card card-pink fade-in-up stagger-1" style={{ marginBottom: 16, textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 11, color: '#8B6B8D', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Today's Prompt</div>
          <p className="display-font" style={{ fontSize: 16, color: '#2D1B2E' }}>"{prompt}"</p>
        </div>
        <div className="fade-in-up stagger-2" style={{ marginBottom: 16 }}>
          <textarea className="input-field" value={journalText} onChange={e => setJournalText(e.target.value)}
            placeholder="Write your thoughts here..." rows={5} style={{ resize: 'vertical', minHeight: 120, lineHeight: 1.6 }} />
        </div>
        <div className="fade-in-up stagger-2" style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#8B6B8D', marginBottom: 8 }}>How are you feeling?</p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {['😊', '🙂', '😐', '😢', '😤'].map((e, i) => (
              <div key={i} style={{ fontSize: 28, cursor: 'pointer', opacity: todayMood === i ? 1 : 0.3, transition: 'all 0.2s', transform: todayMood === i ? 'scale(1.2)' : 'scale(1)' }}
                onClick={() => setTodayMood(i)}>{e}</div>
            ))}
          </div>
        </div>
        <button className="btn-primary fade-in-up stagger-3" style={{ width: '100%', marginBottom: 24 }} onClick={addJournalEntry}>
          Save Entry ✨
        </button>
        {userData.journalEntries.length > 0 && (
          <div className="fade-in-up stagger-4">
            <div className="display-font" style={{ fontSize: 18, color: phaseColor, marginBottom: 12 }}>Past Entries</div>
            {userData.journalEntries.slice(0, 10).map(entry => (
              <div key={entry.id} className="card" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#8B6B8D' }}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span style={{ fontSize: 11, color: PHASES[entry.phase]?.color, background: `${PHASES[entry.phase]?.color}15`, padding: '2px 8px', borderRadius: 8 }}>
                    {PHASES[entry.phase]?.emoji} {PHASES[entry.phase]?.name.split(' ')[0]}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#2D1B2E', lineHeight: 1.5 }}>{entry.text}</p>
                {entry.mood !== null && <div style={{ marginTop: 6 }}>{['😊', '🙂', '😐', '😢', '😤'][entry.mood]}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // MEDITATE
  else if (screen === 'meditate') {
    screenContent = (
      <div className="screen-content">
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 20 }}>Meditate</div>
        {/* Timer */}
        <div className="fade-in-up stagger-1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div className={`timer-circle ${meditationActive ? 'active' : ''}`}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: phaseColor }}>{formatTime(meditationRemaining)}</div>
              <div style={{ fontSize: 12, color: '#8B6B8D' }}>{meditationActive ? 'Breathe...' : 'Ready'}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }} className="fade-in-up stagger-2">
          {[5, 10, 15, 20].map(m => (
            <button key={m} className={`chip ${meditationTime === m * 60 ? 'selected' : ''}`}
              onClick={() => { setMeditationTime(m * 60); setMeditationRemaining(m * 60); setMeditationActive(false); }}>
              {m} min
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }} className="fade-in-up stagger-2">
          <button className="btn-primary" onClick={() => { if (!meditationActive) { setMeditationRemaining(meditationTime); } setMeditationActive(!meditationActive); }}>
            {meditationActive ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="btn-secondary" onClick={() => { setMeditationActive(false); setMeditationRemaining(meditationTime); }}>Reset</button>
        </div>
        {/* Guided Sessions */}
        <div className="display-font fade-in-up stagger-3" style={{ fontSize: 18, color: phaseColor, marginBottom: 12 }}>Recommended for you</div>
        {phaseMeditations.map((m, i) => (
          <div key={m.id} className={`card fade-in-up stagger-${Math.min(i + 4, 5)}`} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
            onClick={() => { setMeditationTime(m.duration * 60); setMeditationRemaining(m.duration * 60); setMeditationActive(false); }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${phaseColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {m.category === 'sleep' ? '😴' : m.category === 'stress' ? '🌊' : m.category === 'focus' ? '🎯' : '🌸'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E' }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#8B6B8D' }}>{m.duration} min · {m.category}</div>
            </div>
            <div style={{ color: phaseColor, fontSize: 20 }}>▶</div>
          </div>
        ))}
      </div>
    );
  }

  // LISTEN
  else if (screen === 'listen') {
    const audioContent = [
      { id: 'l1', title: 'Cycle Wisdom Podcast', type: 'podcast', duration: '25 min', description: 'Understanding your hormonal shifts' },
      { id: 'l2', title: 'Rain & Thunder', type: 'nature', duration: '60 min', description: 'Soothing storm sounds for deep rest' },
      { id: 'l3', title: 'Ocean Waves', type: 'nature', duration: '45 min', description: 'Rhythmic waves for meditation' },
      { id: 'l4', title: 'Body Literacy Talk', type: 'podcast', duration: '30 min', description: 'Connecting with your cycle' },
      { id: 'l5', title: 'Forest Birdsong', type: 'nature', duration: '30 min', description: 'Morning forest ambiance' },
      { id: 'l6', title: 'Sleep Stories', type: 'guided', duration: '20 min', description: 'Gentle stories to drift off to sleep' }
    ];
    screenContent = (
      <div className="screen-content" style={{ position: 'relative' }}>
        <div className="watermark display-font" style={{ top: -10, left: -10, fontSize: 60 }}>Listen</div>
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 20, position: 'relative', zIndex: 1 }}>Listen</div>
        {audioContent.map((a, i) => (
          <div key={a.id} className={`card fade-in-up stagger-${Math.min(i + 1, 5)}`} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${phaseColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {a.type === 'podcast' ? '🎙️' : a.type === 'nature' ? '🌿' : '📖'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E' }}>{a.title}</div>
              <div style={{ fontSize: 12, color: '#8B6B8D' }}>{a.duration} · {a.type}</div>
            </div>
            <div style={{ color: phaseColor, fontSize: 20 }}>▶</div>
          </div>
        ))}
      </div>
    );
  }

  // BODY (standalone)
  else if (screen === 'body') {
    setScreen('wellness');
    setWellnessTab('body');
    screenContent = null;
  }

  // PROFILE
  else if (screen === 'profile') {
    screenContent = (
      <div className="screen-content">
        <div className="display-font fade-in-up" style={{ fontSize: 28, color: phaseColor, marginTop: 8, marginBottom: 20 }}>Profile</div>
        <div className="card fade-in-up stagger-1" style={{ textAlign: 'center', marginBottom: 20, padding: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${phaseColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 12px' }}>
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#2D1B2E' }}>{userData.name}</div>
          <div style={{ fontSize: 13, color: '#8B6B8D' }}>{authUser?.email}</div>
        </div>
        <div className="card fade-in-up stagger-2" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1B2E', marginBottom: 10 }}>Your Preferences</div>
          {[
            ['🗓️', 'Cycle', `${userData.cycleLength} days, ${userData.periodDuration}-day period`],
            ['🥗', 'Diet', userData.dietPreferences.join(', ') || 'No restrictions'],
            ['⚠️', 'Allergies', userData.allergies.join(', ') || 'None'],
            ['💪', 'Fitness', `${userData.fitnessLevel} · ${userData.workoutPreferences.join(', ') || 'Not set'}`],
          ].map(([emoji, label, value]) => (
            <div key={label} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0e0e5', alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>{emoji}</span>
              <div><div style={{ fontSize: 11, color: '#8B6B8D' }}>{label}</div><div style={{ fontSize: 13, color: '#2D1B2E' }}>{value}</div></div>
            </div>
          ))}
        </div>
        <div className="fade-in-up stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-secondary" style={{ width: '100%' }} onClick={() => { setScreen('onboarding'); setOnboardStep(0); }}>
            Edit Preferences
          </button>
          <button style={{ width: '100%', padding: '14px 32px', borderRadius: 25, border: '2px solid #e8d0d8', background: 'white',
            color: '#B2002D', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onClick={handleLogout}>
            Sign Out
          </button>
        </div>
        {userData.moodLog.length > 0 && (
          <div className="fade-in-up stagger-4" style={{ marginTop: 24 }}>
            <div className="display-font" style={{ fontSize: 18, color: phaseColor, marginBottom: 10 }}>Recent Mood Log</div>
            {userData.moodLog.slice(0, 7).map((m, i) => (
              <div key={i} className="card" style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12 }}>
                <span style={{ fontSize: 13, color: '#8B6B8D' }}>{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2D1B2E' }}>{m.mood}</span>
                <span style={{ fontSize: 11, color: PHASES[m.phase]?.color }}>{PHASES[m.phase]?.emoji}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback
  if (!screenContent) {
    screenContent = <div className="screen-content"><p>Loading...</p></div>;
  }

  return (
    <div className="rhythm-app" style={{ '--phase-color': phaseColor }}>
      <style>{css}</style>
      <WaveHeader />
      {screenContent}
      <NavBar />
      <QuickLogModal />
    </div>
  );
}
