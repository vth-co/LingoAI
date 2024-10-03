const { GoogleGenerativeAI } = require("@google/generative-ai");
const { sendEmailVerification } = require("firebase/auth");
// Access your API key as an environment variable (see "Set up your API key" above)
const apiKey = process.env.REACT_APP_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

//generate questions from ai based on different topic
async function generateQuestionsByAI(
  concept_name,
  topic,
  native_language,
  level,
  topic_id
) {
  // console.log(
  //   "am i hitting generateVocabularyQuestionsByAI functions and check the user level: ",
  //   concept_name,
  //   topic,
  //   native_language,
  //   level
  // );
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  let picked_concept = concept_name.toLowerCase().split(" ").join("")
  let picked_topic = topic.toLowerCase().split(" ").join("")
  const jsonschema = `JSON schema: { "type":"array", "properties": {"id": "integer", "question": "string",  "options": "array",  "answer": "string", "explanation": "string", "isAttempted": false }}.`;
  const role = `You're an English teacher. Your task is to create questions and answers  that help non-native English speakers earn and enhance their English skills. Consider various contexts and attributes relevant to each category, and don't hesitate to include examples that span basic to advanced levels, incorporating different nuances, descriptions, and sensory experiences. Your aim is to foster a rich understanding of the language and its diverse applications.`;

  const vocabulary_nouns_content = {
    Beginner: "Everyday objects and common items encountered in daily life.",
    Intermediate: "A variety of objects used in different contexts, including work, hobbies, and travel.",
    Advanced: "Terms you might hear in professional or academic settings.",
  };



  const vocabulary_verbs_content = {
    Beginner: "Basic verbs",
    Intermediate: "Modal verbs",
    Advanced: "Advanced verbs including those with nuanced meanings"
  };

  const vocabulary_adjectives_content = {
    // Beginner: "Simple adjectives describing colors, sizes, and basic emotions (e.g., happy, sad, big, small).",
    // Intermediate: "Comparative and superlative adjectives (e.g., bigger, happiest) and more descriptive terms (e.g., fascinating, terrifying).",
    // Advanced: "Advanced descriptive language (e.g., intricate, minuscule, volatile)."
    Beginner: "Simple adjectives",
    Intermediate: "Comparative and superlative adjectives ",
    Advanced: "Advanced descriptive language"
  };

  const vocabulary_pronouns_content = {
    Beginner: "Basic pronouns",
    Intermediate: "Reflexive pronouns, relative pronouns",
    Advanced: "Indefinite pronouns, complex relative pronouns"
  };

  const grammar_sentence_structure_question = {
    Beginner: "Basic SVO (Subject-Verb-Object) sentence structure.",
    Intermediate: "Compound and complex sentences",
    Advanced: "Use of subordinate clauses and participle clauses "
  };

  const grammar_tense_question = {
    Beginner: "Present Simple Tense: Basic statements and questions",
    Intermediate: "Past Tense: Past Simple, Past Continuous",
    Advanced: "Future Tense: Future Simple, Future Continuous"
  };

  const grammar_prepositions_question = {
    Beginner: "Basic prepositions.",
    Intermediate: "Complex prepositions",
    Advanced: "Advanced prepositional use in idiomatic expressions"
  };

  const grammar_articles_question = {
    Beginner: "Basic use of 'a', 'an', 'the'",
    Intermediate: "Specific and general use of articles, and when to omit them",
    Advanced: "Nuanced article usage"
  };

  const everyday_situations_introductions_question = {
    Beginner: "Basic self-introductions",
    Intermediate: "Detailed personal introductions",
    Advanced: "Professional introductions, networking, and formal settings."
  };

  const everyday_situations_familyandfriends_question = {
    Beginner: "Describing family members and close friends.",
    Intermediate: "Discussing relationships, family traditions, and friend dynamics.",
    Advanced: "Complex family structures and nuanced discussions about relationships."
  };

  const everyday_situations_dailyroutines_question = {
    Beginner: "Simple descriptions of daily activities and times of day.",
    Intermediate: "Detailed routines, discussing habits and frequency.",
    Advanced: "Complex schedules, discussing productivity and time management."
  };

  const everyday_situations_shopping_question = {
    Beginner: "Asking about prices, sizes, colors, and availability; simple questions about where to find items in the store.",
    Intermediate: "Comparing products; asking for recommendations or alternatives; discussing sales and discounts.",
    Advanced: "Navigating returns and exchanges; discussing product issues; inquiring about store policies and warranties."
  };


  let prompt;

  // Determine the correct prompt based on concept and topic
  try {
    if (picked_concept === "vocabulary") {
      if (picked_topic === "nouns") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on the topic '${vocabulary_nouns_content[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "verbs") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on the topic '${vocabulary_verbs_content[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Avoid using verbs that may create ambiguity (like 'go', 'walk', and 'run') unless the sentence provides additional context to clarify the difference.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence. Include why other options are incorrect — be sure to include those options as well.
        ${jsonschema}`;

      } else if (picked_topic === "adjectives") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on the topic '${vocabulary_adjectives_content[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "pronouns") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on the topic '${vocabulary_pronouns_content[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Make sure the correct pronoun type (e.g., possessive, subject, reflexive) is chosen based on the sentence.
                  - If the subject is a person or an animal, specify the gender to avoid confusion between 'He', 'She', 'It', 'They', and possessive forms like 'His', 'Her'.
                  - Avoid using gender-neutral pronouns like 'It' unless the context explicitly supports it (e.g., inanimate objects).
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      }
    } else if (picked_concept === "grammar") {
      if (picked_topic === "sentencestructure") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on sentence structure. '${grammar_sentence_structure_question[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "tense") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions focusing on tenses. '${grammar_tense_question[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "prepositions") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on prepositions. '${grammar_prepositions_question[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, considering the overall meaning of the sentence, as well as explanations for why the other options are incorrect. Be specific about any idiomatic expressions or rules regarding preposition usage when applicable.
                  ${jsonschema}`;
      } else if (picked_topic === "articles") {
        prompt = `${role} For a ${level} learner, create 3 unique fill-in-the-blank questions on articles. '${grammar_articles_question[level]}'. Ensure that:
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, considering the overall meaning of the sentence and the context of the noun.
                  - Explain why the chosen article (e.g., "a," "an," "the") fits based on whether the noun is countable or uncountable, singular or plural, and whether it is being introduced for the first time or has already been mentioned.
                  - For "a" and "an," clarify that "a" is used before words that begin with a consonant sound, while "an" is used before words that begin with a vowel sound (e.g., "an apple," "a banana") in the explanation.
                  - Additionally, specify why other options are incorrect in the explanation. For example, if "the" is chosen, explain that it cannot be used for nouns that have not yet been introduced in the context. If "no article" is presented as an option, clarify that it applies only in cases where the noun represents a general concept rather than a specific instance.
                  ${jsonschema}`;
      }
    } else if (picked_concept === "everydaysituations") {
      if (picked_topic === "introductions") {
        prompt = `${role} For a ${level} learner, create 3 unique questions involving dialogues related to introductions. '${everyday_situations_introductions_question[level]}'. Ensure that:
                  - Each question presents a realistic scenario with a fill-in-the-blank format.
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "familyandfriends") {
        prompt = `${role} For a ${level} learner, create 3 unique questions involving dialogues related to family and friends. '${everyday_situations_familyandfriends_question[level]}'. Ensure that:
                  - Each question presents a realistic scenario with a fill-in-the-blank format.
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "dailyroutines") {
        prompt = `${role} For a ${level} learner, create 3 unique questions involving dialogues related to daily routines. '${everyday_situations_dailyroutines_question[level]}'. Ensure that:
                  - Each question presents a realistic scenario with a fill-in-the-blank format.
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      } else if (picked_topic === "shopping") {
        prompt = `${role} For a ${level} learner, create 3 unique questions involving dialogues related to shopping. '${everyday_situations_shopping_question[level]}'. Ensure that:
                  - Each question presents a realistic scenario with a fill-in-the-blank format.
                  - Provide 4 distinct and contextually appropriate answer options in English, with only one answer being the best fit based on the specific context of the sentence.
                  - Ensure that the correct answer must always match one of the provided answer options. If the generated answer does not match any of the options, generate a new question.
                  - Include clear reasons in ${native_language} for why the chosen answer is correct, taking into account the overall meaning of the sentence, and why other options are incorrect.
                  ${jsonschema}`;
      }
    } else {
      throw new Error("Invalid concept or topic");
    }
  } catch (error) {
    console.error("Error constructing prompt:", error);
    return error;
  }

  // Generate content from the AI model
  try {
    const result = await model.generateContent(prompt);
    // console.log("Generated result: ", result);

    const jsonString = result.response.text();
    let jsonData = JSON.parse(jsonString);

    // Validate the generated questions to ensure they match the criteria
    // jsonData.forEach((item) => {
    //   const { question, options, answer } = item;
    //   if (!options.includes(answer)) {
    //     throw new Error(
    //       `Generated answer '${answer}' does not match any of the options for question: '${question}'`
    //     );
    //   }
    // });

    jsonData.forEach((item) => {
      const { question, options, answer } = item;

      // Normalize the answer and options for consistent comparison
      const normalizedAnswer = answer.trim().toLowerCase();
      const normalizedOptions = options.map(option => option.trim().toLowerCase());

      // Check for match
      if (!normalizedOptions.includes(normalizedAnswer)) {
        console.log("Question:", question);
        console.log("Options:", normalizedOptions);
        console.log("Generated Answer:", normalizedAnswer);
        throw new Error(
          `Generated answer '${answer}' does not match any of the options for question: '${question}'`
        );
      }
    });


    return { topic_id, topic, level, jsonData };
  } catch (error) {
    console.error("Error generating content or validating response:", error);
  }

}

module.exports = {
  generateQuestionsByAI,
};
