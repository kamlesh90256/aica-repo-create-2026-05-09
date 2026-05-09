type ChatMessage = { role: string; content: string };

function summarizeUserIntent(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('resume')) return 'resume improvement';
  if (lower.includes('interview')) return 'interview preparation';
  if (lower.includes('cover letter')) return 'cover letter writing';
  if (lower.includes('roadmap') || lower.includes('learn') || lower.includes('plan')) return 'learning roadmap';
  if (lower.includes('backend') || lower.includes('full stack') || lower.includes('devops')) return 'learning roadmap';
  if (lower.includes('job') || lower.includes('career')) return 'career strategy';

  return 'general guidance';
}

function buildGuidance(intent: string, userText: string): string {
  if (intent === 'resume improvement') {
    return [
      'Here is a quick resume upgrade plan:',
      '1. Add a one-line professional summary tailored to the role.',
      '2. Rewrite each bullet with action + impact + metric.',
      '3. Put strongest technical skills near the top.',
      '4. Match keywords from the target job description.',
      '',
      'If you share your target role, I can draft improved bullet points.'
    ].join('\n');
  }

  if (intent === 'interview preparation') {
    return [
      'Interview prep plan:',
      '1. Prepare a 60-second intro using Present -> Past -> Future.',
      '2. Practice 5 STAR stories (challenge, action, measurable result).',
      '3. Prepare role-specific technical questions and model answers.',
      '4. End with thoughtful questions about team goals and success metrics.',
      '',
      'Tell me the role and I will generate a mock interview set.'
    ].join('\n');
  }

  if (intent === 'cover letter writing') {
    return [
      'Cover letter template:',
      '1. Opening: role, company, and one concrete reason you fit.',
      '2. Middle: 2 achievements tied to the job requirements.',
      '3. Closing: enthusiasm + clear call to action.',
      '',
      'Share the job posting and I will draft a custom letter.'
    ].join('\n');
  }

  if (intent === 'learning roadmap') {
    return [
      'Learning roadmap (4 weeks):',
      'Week 1: Core fundamentals and one small project.',
      'Week 2: Intermediate concepts + code reviews.',
      'Week 3: Build a portfolio-quality feature end to end.',
      'Week 4: Mock interview + resume and project polish.',
      '',
      'Share your current level and target role for a personalized roadmap.'
    ].join('\n');
  }

  if (intent === 'career strategy') {
    return [
      'Career strategy checklist:',
      '1. Define your target role and 10 target companies.',
      '2. Tailor resume and LinkedIn for that role.',
      '3. Build 2 relevant projects proving role readiness.',
      '4. Apply with referrals and track outcomes weekly.',
      '',
      'I can help create a role-specific 30-day action plan.'
    ].join('\n');
  }

  return [
    'I can help with resume, interviews, cover letters, and career planning.',
    `You asked: "${userText.trim().slice(0, 220)}"`,
    'If you want a stronger answer, include your target role and experience level.'
  ].join('\n');
}

export function generateLocalAssistantReply(messages: ChatMessage[]): string {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const intent = summarizeUserIntent(lastUserMessage);
  return buildGuidance(intent, lastUserMessage);
}
