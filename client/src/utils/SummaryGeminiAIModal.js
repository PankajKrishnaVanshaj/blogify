const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const generateSummary = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: '"Summarize the following blog post into a concise and clear paragraph that highlights the main points and key takeaways. Focus on the most important aspects of the content while keeping it brief and engaging. Make sure to maintain the tone of the original content and provide a balanced overview without including unnecessary details. Here\'s the blog post content: [7 Simple and Effective Health and Fitness Tips to Achieve Your Goals\n\nIn the world of health and fitness, achieving your goals can feel overwhelming with the endless advice available. However, success doesn’t come from extreme diets or complicated exercise routines. Instead, it’s about adopting simple, sustainable habits that improve your overall well-being. Whether you’re looking to lose weight, build muscle, or simply live a healthier lifestyle, these 7 tips will help you make consistent progress toward your health and fitness goals.\n\n1. Set Clear and Achievable Health and Fitness Goals\nSetting SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals is crucial for staying motivated and focused. Start by defining clear, realistic goals such as exercising three times a week or drinking more water. Breaking them into smaller, actionable steps will help you stay on track. Tracking your progress is important to celebrate small wins and adjust when needed.\n\n2. Prioritize Consistency Over Perfection\nFitness success is all about consistency, not perfection. You don’t have to work out every day or follow a strict diet plan. Instead, aim for regular exercise and balanced meals. Missing a workout or enjoying a treat is normal, but the key is to get back on track the next day. It’s the consistent effort that yields long-term results.\n\n3. Incorporate Variety in Your Workout Routine\nTo keep your workouts engaging and prevent plateaus, it’s important to mix things up. Include a combination of strength training, cardio, flexibility exercises, and activities you enjoy. This approach not only works different muscle groups but also helps you stay motivated and excited about your fitness journey.\n\n4. Focus on Quality Sleep and Proper Recovery\nSleep is often overlooked, but it’s essential for muscle repair, mental health, and overall fitness progress. Aim for 7–9 hours of sleep each night to give your body time to recover and regenerate. Additionally, make sure to schedule rest days to avoid overtraining and reduce the risk of injury.\n\n5. Eat a Balanced Diet to Fuel Your Body\nNutrition plays a crucial role in achieving fitness goals. Focus on whole, nutrient-dense foods like vegetables, fruits, lean proteins, whole grains, and healthy fats. A balanced diet fuels your workouts, supports muscle recovery, and keeps your energy levels stable throughout the day. Avoid crash diets and aim for sustainable, healthy eating habits.\n\n6. Stay Hydrated for Optimal Performance\nWater is essential for maintaining energy levels, improving digestion, and enhancing physical performance. Dehydration can lead to fatigue and poor exercise performance. Make sure to drink plenty of water throughout the day, especially before, during, and after workouts. Carry a water bottle with you to remind yourself to hydrate consistently.\n\n7. Make Health and Fitness a Lifestyle, Not a Short-Term Goal\nFor lasting results, treat fitness and health as a lifestyle, not a temporary fix. Incorporate physical activity into your daily routine by walking, taking the stairs, or stretching during breaks. The goal is to find activities you enjoy and make them a permanent part of your life. Healthy habits, like eating well and staying active, should be sustainable in the long term.\n\nConclusion: Achieving Your Health and Fitness Goals Starts with Small Steps\nHealth and fitness are about progress, not perfection. By focusing on consistency, proper nutrition, adequate sleep, and regular exercise, you’ll create a foundation for success. Remember, it’s not about how quickly you achieve your goals, but how steadily you work towards them. By following these 7 simple tips, you’ll be well on your way to living a healthier and more active life.]"\n\n',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "This blog post emphasizes that achieving health and fitness goals doesn't require drastic measures but rather a commitment to simple, sustainable habits. It highlights the importance of setting clear, achievable goals and prioritizing consistency over perfection. The key to a successful fitness journey includes incorporating varied workouts, ensuring quality sleep and recovery, eating a balanced diet rich in whole foods, and staying hydrated. Ultimately, the post encourages readers to view health and fitness as a lifestyle, not a temporary fix, by integrating physical activity into their daily routines and making healthy habits a permanent part of their lives.\n",
        },
      ],
    },
  ],
});
