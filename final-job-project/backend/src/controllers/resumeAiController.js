import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const groq = new Groq({
  apiKey:process.env.GROQ_API_KEY,
});

export const analyzeresume = async(req,res)=>{
    try {
        const {resumeText} = req.body;

        if(!resumeText) {
            return res.send(400).json({
                result:"please provide resume text",
            });
        }

      const completion = await groq.chat.completions.create({
      model:'llama-3.1-8b-instant',
      messages:[
        {
          role:'system',
          content:'you are a resume analysis assistant...'
        },
        {
          role:'user',
          content:`analyze resume and give feedback:\n\n${resumeText}`,
        },
      ],
      temperature:0.5,
      max_tokens:500,
    });

    const result = completion.choices?.[0]?.message?.content ||'No feedback genarate';
    res.json({result});
    } catch(err) {
        console.error(err);
    }
}