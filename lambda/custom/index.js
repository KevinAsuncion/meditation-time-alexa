const Alexa = require("ask-sdk-core");

const STREAMS = [
  {
    token: "meditation-1",
    url:
      "https://self-compassion.org/wp-content/uploads/2016/11/affectionatebreathing_cleaned.mp3",
    metadata: {
      title: "Affectionate Breathing"
    }
  },
  {
    token: "meditation-2",
    url:
      "https://self-compassion.org/wp-content/uploads/2016/11/LKM_cleaned.mp3",
    metadata: {
      title: "Self Compassion Loving Kindness"
    }
  },
  {
    token: "meditation-3",
    url:
      "https://health.ucsd.edu/specialties/mindfulness/programs/mbsr/Documents/MP3/20_Min_Body_Scan3.mp3",
    metadata: {
      title: "Body Scan"
    }
  },
  {
    token: "meditation-4",
    url:
      "https://health.ucsd.edu/specialties/mindfulness/programs/mbsr/Documents/MP3/Awareness-of-Breath.mp3",
    metadata: {
      title: "Awareness of Breath"
    }
  },
  {
    token: "meditation-5",
    url:
      "https://health.ucsd.edu/specialties/mindfulness/programs/mbsr/Documents/MP3/Cassondra-Graff-Loving-Kindness-for-a-Loved-One-15min.mp3",
    metadata: {
      title: "Loving Kindness For A Loved One"
    }
  },
  {
    token: "meditation-6",
    url:
      "https://health.ucsd.edu/specialties/mindfulness/programs/mbsr/Documents/MP3/Noriko-Harth-15-Minute-Giving-and-Receiving-Compassion.mp3",
    metadata: {
      title: "Giving and Receiving Compassion"
    }
  },
  {
    token: "meditation-7",
    url:
      "https://self-compassion.org/wp-content/uploads/2016/11/bodyscan_cleaned.mp3",
    metadata: {
      title: "Compassionate Body Scan"
    }
  },
  {
    token: "meditation-8",
    url:
      "https://self-compassion.org/wp-content/uploads/2016/11/noting.practice_cleaned.mp3",
    metadata: {
      title: "Noting Emotions"
    }
  },
  {
    token: "meditation-9",
    url:
      "https://self-compassion.org/wp-content/uploads/2016/11/LKM.self-compassion_cleaned.mp3",
    metadata: {
      title: "Self Compassion 2"
    }
  },
  {
    token: "meditation-10",
    url:
      "https://health.ucsd.edu/specialties/mindfulness/programs/mbsr/Documents/MP3/10_Min_Wisdom_Meditation.mp3",
    metadata: {
      title: "Wisdom"
    }
  }
];

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "LaunchRequest" ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name ===
          "PlayStreamIntent") ||
      (handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.ResumeIntent")
    );
  },
  handle(handlerInput) {

    const streamIndex = Math.floor(Math.random() * STREAMS.length);
    const stream = STREAMS[streamIndex];

    handlerInput.responseBuilder
      .speak(`Now playing ${stream.metadata.title} meditation`)
      .addAudioPlayerPlayDirective(
        "REPLACE_ALL",
        stream.url,
        stream.token,
        0,
        null,
        stream.metadata
      );

    return handlerInput.responseBuilder.getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText =
      "This skills plays a random meditation. It does not have any additional functionality.";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AboutIntent"
    );
  },
  handle(handlerInput) {
    const speechText =
      "This skill plays a random guided meditation, just open it and get ready to meditate";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.StopIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.PauseIntent")
    );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective("CLEAR_ALL")
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder.getResponse();
  }
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type ===
      "AudioPlayer.PlaybackStopped"
    );
  },
  handle(handlerInput) {
    return true;
  }
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type ===
      "AudioPlayer.PlaybackStarted"
    );
  },
  handle(handlerInput) {
    handlerInput.responseBuilder.addAudioPlayerClearQueueDirective(
      "CLEAR_ENQUEUED"
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ExceptionEncounteredRequestHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type ===
      "System.ExceptionEncountered"
    );
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return true;
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective("CLEAR_ALL")
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    PlayStreamIntentHandler,
    PlaybackStartedIntentHandler,
    CancelAndStopIntentHandler,
    PlaybackStoppedIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    ExceptionEncounteredRequestHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
