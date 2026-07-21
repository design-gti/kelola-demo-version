import { IDPFormData } from "../components/AspectDevelopmentPanel";

export interface AIGeneratedTask {
  task: string;
}

export interface AIGeneratedRecommendation {
  competency: string;
  developmentGoal: string;
  successMeasures: string[];
  tasks: AIGeneratedTask[];
  duration: string;
  mentor: string;
}

/**
 * Generate AI-powered IDP recommendation based on user input
 * Focus on Job Assignment tasks
 */
export function generateAIRecommendation(formData: IDPFormData): AIGeneratedRecommendation[] {
  const recommendations: AIGeneratedRecommendation[] = [];
  
  // For each selected aspect, generate personalized recommendation
  formData.selectedAspects.forEach(aspectName => {
    const developmentGoal = formData.developmentGoals[aspectName] || "";
    
    // Generate development goal based on user input or create default
    const aiDevelopmentGoal = developmentGoal.trim() 
      ? `${developmentGoal}` 
      : `Improve ${aspectName} competency to meet organizational standards and excel in job responsibilities`;
    
    // Generate success measures based on development goal and aspect
    const successMeasures = generateSuccessMeasures(aspectName, developmentGoal, formData.programDetails);
    
    // Generate tasks based on job assignment details
    const tasks = generateTasks(
      aspectName, 
      formData.programDetails,
      developmentGoal
    );
    
    recommendations.push({
      competency: aspectName,
      developmentGoal: aiDevelopmentGoal,
      successMeasures,
      tasks,
      duration: "3-6 months",
      mentor: "Direct Supervisor"
    });
  });
  
  return recommendations;
}

function generateSuccessMeasures(
  aspectName: string, 
  developmentGoal: string,
  jobAssignment: string
): string[] {
  const measures: string[] = [];
  
  // Base success measure
  measures.push(`Achieve competency score of 4 or above in ${aspectName} within the development period`);
  
  // Add goal-specific measure if development goal is provided
  if (developmentGoal.trim()) {
    measures.push(`Successfully demonstrate ${developmentGoal.toLowerCase()} in daily work activities`);
  }
  
  // Add job assignment specific measures
  if (jobAssignment.trim()) {
    measures.push(`Complete assigned tasks in ${jobAssignment.toLowerCase()} with high quality and on time`);
  }
  
  // Add feedback measure
  measures.push("Receive positive feedback from supervisor on performance improvement and skill application");
  
  return measures;
}

function generateTasks(
  aspectName: string,
  jobAssignment: string,
  developmentGoal: string
): AIGeneratedTask[] {
  const tasks: AIGeneratedTask[] = [];
  
  // Parse job assignment to understand the context
  const assignmentLower = jobAssignment.toLowerCase();
  
  // Task 1: Initial planning and goal setting
  tasks.push({
    task: `Conduct initial meeting with supervisor to clarify expectations, objectives, and success criteria for ${aspectName} development through ${jobAssignment}`
  });
  
  // Task 2: Based on job assignment context
  if (assignmentLower.includes("project") || assignmentLower.includes("task")) {
    tasks.push({
      task: `Execute ${jobAssignment} with focus on applying ${aspectName} skills, documenting challenges and learnings throughout the process`
    });
  } else {
    tasks.push({
      task: `Complete assigned responsibilities in ${jobAssignment} while actively practicing and developing ${aspectName} competency`
    });
  }
  
  // Task 3: Regular check-ins and feedback
  tasks.push({
    task: `Schedule bi-weekly check-in sessions with supervisor to review progress, discuss challenges, and receive coaching on ${aspectName} application`
  });
  
  // Task 4: Specific to development goal if provided
  if (developmentGoal.trim()) {
    tasks.push({
      task: `Work towards achievement of development goal: "${developmentGoal}" through practical application in ${jobAssignment}`
    });
  } else {
    tasks.push({
      task: `Identify and implement best practices for ${aspectName} within the context of ${jobAssignment}`
    });
  }
  
  // Task 5: Reflection and documentation
  tasks.push({
    task: `Maintain a learning journal documenting key insights, improvements, and examples of ${aspectName} application throughout the assignment period`
  });
  
  // Task 6: Knowledge sharing
  tasks.push({
    task: `Prepare and present end-of-program review showcasing ${aspectName} development achievements and lessons learned from ${jobAssignment}`
  });
  
  return tasks;
}

/**
 * Format the AI recommendation for display in dialog
 */
export function formatRecommendationForDisplay(recommendations: AIGeneratedRecommendation[]): string {
  let formatted = "AI-GENERATED IDP RECOMMENDATION\n\n";
  
  recommendations.forEach((rec, index) => {
    formatted += `${index + 1}. ${rec.competency}\n`;
    formatted += `   Goal: ${rec.developmentGoal}\n\n`;
    formatted += `   Success Measures:\n`;
    rec.successMeasures.forEach(measure => {
      formatted += `   â€¢ ${measure}\n`;
    });
    formatted += `\n   Tasks:\n`;
    rec.tasks.forEach(task => {
      formatted += `   â€¢ ${task.task}\n`;
    });
    formatted += `\n   Duration: ${rec.duration}\n`;
    formatted += `   Mentor: ${rec.mentor}\n`;
    formatted += "\n";
  });
  
  return formatted;
}
