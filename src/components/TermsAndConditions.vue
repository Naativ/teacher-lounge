<template>
  <div class="text-xs-left">
      <h4>Please Note:</h4><p>By uploading you are agreeing to the
        <a
          @click="showTerms = true"
        >Terms And Conditions</a> of the Naativ Library.</p>
    <v-dialog v-model="showTerms" width="100%" max-width="600px">
      <v-card>
        <v-card-title class="application-title"><h3>Library Terms and Conditions</h3></v-card-title>
        <v-divider></v-divider>
        <v-card-text>
        <p>Thank you for showing interest in submitting content to the Naativ Library. Please read below the submission requirements:</p>
        <ul>
          <li>Videos submitted must be a maximum of (3) three minutes in duration.</li>
          <li>Videos and PDF submissions must have a resolution suitable for laptop projection. Content not achieving suitable resolution will not be approved.</li>
          <li>By submitting any content you agree to the terms, including waiver and submission terms, found below.</li>
          <li>No copyrighted material may be used.</li>
          <li>All videos MUST include a title, description, and identification tags.</li>
          <li>Naativ may not approve any submission for any reason, including if it determines that the submission contains unacceptable content. Naativ is under no obligation to disclose why a submission has not been approved.</li>
        </ul>
        <p>Additional Terms:</p>
        <ol>
          <li>By submitting a Naativ library content submission (a “Submission”), you agree that Naativ shall have a perpetual, irrevocable, assignable, royalty free, fully paid-up license and you unconditionally assign and transfer to Naativ all rights, ownership, title, interest and claim (including without limitation all copyrights), which you now have or may have in the future, to a Submission (including, without limitation, the submitted video), whether or not acceptable to Naativ and regardless of the form they take, or any element(s) thereof and further grant to Naativ the right to use, publish, exploit and/or modify any entry and/or video submitted in connection herewith in any manner it wishes, regardless if the media is now existing or hereafter created. Naativ reserves the right to edit and/or modify any video content or video titles and publish or advertise the video without your approval, acknowledgement or compensation unless prohibited by law. By submitting a Submission, you agree to defend, release and hold harmless Naativ and its agents from and against any claims, action and/or liability for injury, loss or damage of any kind resulting from your participation herein (including in connection with the use and/or exploitation of a Submission) or from the acceptance or use of any prize awarded, if applicable. Naativ reserves the right to verify eligibility qualifications of any winner from any contest Naativ may decide to run. US law governs these contest rules.</li>
          <li>Naativ has the right to modify, use, assign or dispose of your Submission however it sees fit without your approval or any third party. You grant Naativ the right to use your name, image, likeness, photograph, voice and biographical material, and video submission, for advertising, publicity and promotion purposes including posting the videos or screen names online for any purpose or on a winner’s list (if applicable) and other online announcements, and for sharing the videos with the media for viewing, whether TV or print, without additional compensation, unless prohibited by law. You shall not receive any compensation or credit for use of entries, other than those disclosed in any contest. You agree that if selected as a winner of a contest, you grant Naativ and its designees the right to film and later publish footage.</li>
          <li>Naativ is not responsible for incorrect or inaccurate transcription of entry information, or for any human or other error, technical malfunctions, lost/delayed data transmission, omission, interruption, deletion, defect, line failures of any telephone network, computer equipment, software, inability to access any online service or web site, or any other error or malfunction, or any injury or damage to participant’s or any other person’s computer related to or resulting from participation herein, or for any injury to person or property, including but not limited to video equipment, arising from your participation herein or for the use or misuse of any prize won, if applicable. Naativ is not responsible for lost, late, illegible or misdirected entries or mail. You warrant that your submission is original, that publication of the submission will not infringe on the rights of others, and you have full power to grant ownership to Naativ as stated herein. Naativ has no obligation of any nature to publish, promote, display or otherwise use any information provided by you, including but not limited to biographical or video content. All taxes are the responsibility of the winners, if applicable.</li>
        </ol>
      </v-card-text>
      <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="showTerms = false">Back To Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TermsAndConditions',
  data() {
    return {
      showTerms: false
    }
  }
}
</script>

<style scoped>

</style>
