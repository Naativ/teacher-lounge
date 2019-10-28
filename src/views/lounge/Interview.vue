<template>
  <div>
    <h3>Thank you for being an interviewer</h3>
    <p>Please select one of these applicants to schedule an appointment</p>

    <v-alert type="success"
             :value="scheduled">
      Thank you for scheduling an interview with {{scheduled && scheduled.name}}
    </v-alert>
    <v-alert type="error"
             :value="error">
     {{error ? error.message : error}}
    </v-alert>

    <v-card>
      <v-card-title>
        <!-- Nutrition
        <v-spacer></v-spacer> -->
        <v-text-field
          v-model.lazy="term"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          placeholder="Name or email"
        ></v-text-field>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="interviewees"
          hide-actions
          class="elevation-1"
          :no-data-text=" term ? 'No matches found' : 'There are no people currently to interview.'"
          :loading="loading"
          item-key="contactEmail"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.contactEmail }}</td>
            <td>{{ props.item.timezone }}</td>
            <td>{{ props.item.province }}</td>
            <td>{{ getAvailablity(props.item.answers) }}</td>
            <td>
              <v-btn v-if="props.item.answers[0]" title="Show More/Less" flat icon small @click="props.expanded = !props.expanded">
                <v-icon v-if="!props.expanded" small>
                  expand_more
                </v-icon>
                <v-icon v-if="props.expanded" small>
                  expand_less
                </v-icon>
              </v-btn>
              <v-btn title="Schedule Interview" flat icon small :loading="props.item.loading" @click="claim(props.item)">
                <v-icon>
                  schedule
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <ul>
                <li v-for="answer in props.item.answers" :key="answer.questionName">
                  <strong>{{answer.questionName}}</strong>
                  &nbsp;&nbsp;&nbsp;
                  {{answer.values[0].value}}
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import moment from 'moment'
import { PENDING_INTERVIEWS } from '@/graphql/Interview.gql.js'
import { createAppointment } from '@/graphql/Appointments.gql.js'
import { UPDATE_MEMBER_TAGS } from '@/graphql/Member.gql.js'

export default {
  name: 'InterviewerLoungeWidget',
  data() {
    return {
      term: '',
      delay: 1000,
      error: null,
      scheduled: undefined,
      loading: true,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'contactEmail' },
        { text: 'Timezone', value: 'timezone' },
        { text: 'State/Province', value: 'province' },
        { text: 'Availability', value: 'availablity' },
        { text: 'Actions', value: 'actions' }
      ],
      interviewees: []
    }
  },
  methods: {
    async claim(member) {
      try {
        member.loading = true

        await this.$apollo.mutate({
          mutation: createAppointment,
          variables: {
            appt: {
              maxUpcoming: 0,
              hostId: this.$store.state.member.id,
              scheduledDate: moment.utc(),
              type: 'INTERVIEW',
              participants: [member.id],
              status: 1
            }
          },
          update: async (store, { data }) => {
            return data && data.upsertAppointment
          }
        })

        await this.$apollo.mutate({
          mutation: UPDATE_MEMBER_TAGS,
          variables: {
            input: {
              memberId: member.id,
              tags: ['interview_scheduled']
            }
          }
        })

        member.loading = false

        this.scheduled = member

        // remove
        this.$apollo.queries.interviewees.refetch()
      } catch (e) {
        member.loading = false
        this.error = e
        console.error('Error claiming stuff: ', e)
      }
      window.scrollTo(0, 0)
    },
    getAvailablity(answers = []) {
      let availablity = 'N/A'
      answers.forEach(a => {
        if (
          a &&
          a.questionName === 'What is your availability for an interview?'
        ) {
          availablity = a.values[0].value
        }
      })
      return availablity
    }
  },
  watch: {
    term() {
      this.$apollo.queries.interviewees.refetch()
    }
  },
  apollo: {
    interviewees: {
      query: PENDING_INTERVIEWS,
      variables() {
        return {
          searchTerm: this.term,
          limit: 100
        }
      },
      pollInterval: 5000,
      update({ getApplicantsToBeInterviewed = [] }) {
        this.loading = false
        return getApplicantsToBeInterviewed.map(i => {
          return { ...i, loading: false }
        })
      }
    }
  }
}
</script>
