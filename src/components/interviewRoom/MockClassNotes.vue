<template>
  <div class="class-notes">
    <div>Welcome to your interview. Please use the curriculum to teach your class. Good Luck and Have Fun!</div>
    <div>
      <h2>{{lesson.title}}</h2>
      <h4 class="my-3">LESSON DESCRIPTION</h4>
      <div v-html="lesson.description"></div>
      <h4 class="my-3">STUDENT LEARNING OBJECTIVES</h4>
      <div v-html="lesson.objective"></div>
      <h4 class="my-3">WORD LIST</h4>
      <h4 v-html="lesson.wordList"></h4>

      <div
        v-for="(slide, index) in lesson.slides"
        :key="index"
        :class="{'active': isCurrentSlide(index + 1)}"
      >
        <h4 class="my-3" :id="`slide${index + 1}`">{{slide.title}}</h4>
        <div v-html="slide.description"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassNotes',
  props: ['currentSlide'],
  data() {
    return {
      lesson: {
        title: 'POPCORN WORDS: COLORS',
        description: '"Popcorn" words are common words that "pop up" regularly in the course of normal conversation, and they are fundamental to early language acquisition and conversation. This lesson will help you teach your students some "popcorn" words for colors and help them practice using those words in brief conversations.',
        objective: '<div> After completion of this lesson students will be able to: </div> <div> <ul> <li>Recognize, spell, and pronounce the color words BLUE, RED, and YELLOW</li> <li>Spell and pronounce words that are commonly associated with those colors</li><li>Use both color and associated words in complete spoken sentences</li></ul></div>',
        wordList: 'BLUE, RED, YELLOW, APPLE, BIRD, BUS, FISH, HAIR, HOUSE, LEAF, SHIRT, SHOE, TRUCK, WHALE',
        slides: [
          {
            title: 'Slide 1',
            description: 'Naativ opener slide'
          },
          {
            title: 'Slide 2',
            description: `Greet your student and introduce the lesson concept: Today, we are going to be
                          learning color words.`
          },
          {
            title: 'Slide 3',
            description: `<b>Bellringer</b>: As a pre-assessment/warm-up, ask students to identify the colors
      of the objects on the slide. If fluency/age is an issue, walk the student through
      the objects and identify the colors (red, blue, yellow) and the objects (sight
      words HOUSE, SHIRT, HAIR).<br/>
      <b>Note</b>: If necessary or desired, circle the objects/sight words as you or the
      student identify them.<br/>`
          },
          {
            title: 'Slide 4',
            description: `Introduce the color word &ldquo;blue&rdquo; by saying the word, spelling the word,
      sounding it phonetically, and pronouncing it again. Then, ask students to complete
      the same process.<br/>
      <b>Note</b>: Students may have difficulty with phonetics, exaggerating the
      &ldquo;bl&rdquo; into &ldquo;buh-lue.&rdquo; Correct and remediate as
      necessary.<br/>`
          },
          {
            title: 'Slide 5',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence. If fluency/age is an issue, give students clues (i.e. mimic
      flapping of wings). Have students complete the sentence using the associate word.`
          },
          {
            title: 'Slide 6',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence. Ask students to read the sentence, and then circle the
      correct sight word on the screen.`
          },
          {
            title: 'Slide 7',
            description: `Students should circle the object and sight word on the screen, and pronounce the
      sight word.<br/>
      <b>Note</b>: If fluency/age permits, or if desired, ask students to identify and
      pronounce the additional sight words and color words (red and yellow, apple and
      bus) This can be used as a reward question if desired.<br/>`
          },
          {
            title: 'Slide 8 (Summative Assessment Activity)',
            description: `Ask students to circle the &ldquo;bl&rdquo; pairs on the slide, and then pronounce
      each word as circled. If fluency/age is an issue, forego student pronunciation and
      focus on correctly identifying the &ldquo;bl&rdquo; pairs.<br/>
      <b>Time Limit</b>: Allow maximum of 1 minute for this activity.<br/>`
          },
          {
            title: 'Slide 9',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence. If fluency/age is an issue, give students clues (i.e. mimic
      walking or running, show them an example, etc.). Have students complete the
      sentence using the associate word.`
          },
          {
            title: 'Slide 10',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence. Ask students to read the sentence, and then circle the
      correct color sight word on the screen.`
          },
          {
            title: 'Slide 11',
            description: `Reinforce the color word &ldquo;red&rdquo; by saying the word, spelling the word,
      sounding it phonetically, and pronouncing it again. Then, ask students to complete
      the same process.`
          },
          {
            title: 'Slide 12',
            description: `Students should circle the object and sight word on the screen, and pronounce the
      sight word.<br/>
      <b>Note</b>: If fluency/age permits, or if desired, ask students to identify and
      pronounce the additional sight words and color words (red and yellow, apple and
      bus) This can be used as a reward question if desired.<br/>`
          },
          {
            title: 'Slide 13',
            description: `Introduce the color word &ldquo;yellow&rdquo; by saying the word, spelling the
      word, sounding it phonetically, and pronouncing it again. Then, ask students to
      complete the same process.`
          },
          {
            title: 'Slide 14',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence. If fluency/age is an issue, give students clues (i.e. mimic
      swimming, show an image, show them an example, etc.). Have students complete the
      sentence using the associate word.`
          },
          {
            title: 'Slide 15',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence. Ask students to read the sentence, and then circle the
      correct color sight word on the screen.`
          },
          {
            title: 'Slide 16 (Sight Word Matching Formative Assessment)',
            description: `Ask students to match the picture to the color word by drawing a line from the word
      to the picture.<br/>
      <b>Time Limit</b>: Allow maximum of 30 seconds for this activity.<br/>`
          },
          {
            title: 'Slide 17 ',
            description: `Ask students to answer the associated word question by reading the question, and
      starting the sentence.`
          },
          {
            title: 'Slide 18 ("Show and Tell" Freeform Conversation Activity)',
            description: `Ask students to show you something from their home that is blue, red, and yellow.
      If fluency is an issue, use pre-staged items to demonstrate the activity to the
      student, and guide student through the activity.<br/>
      <b>Note</b>: Adjust this activity for fluency as necessary.<br/>`
          },
          {
            title: 'Slide 19 ("Word Wall" Vocabulary Builder Conversation Activity)',
            description: `Celebrate student achievement by pointing out the number of words they have learned
        today!<br/>
        <b>Note</b>: As a summative assessment, if you have time left over at the end of
        the lesson, lead students in a &ldquo;Word Wall Challenge.&rdquo; Either spell or
        pronounce 5 words from the wall at random, and ask students to circle the words.
        Alternately, ask students to choose 5 words randomly and spell and pronounce them.
        If fluency permits: As a potential reward activity, encourage them to use one of
        the words in a sentence.<br/>`
          },
          {
            title: 'Slide 20',
            description: `Naativ closer slide`
          }
        ]
      }
    }
  },
  methods: {
    isCurrentSlide(slide) {
      return this.currentSlide === slide
    }
  }
}
</script>

<style lang="stylus" scoped>
.active {
  background-color: rgba(252, 186, 0, 0.25);
}
</style>
