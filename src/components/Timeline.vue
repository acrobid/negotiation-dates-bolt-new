<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import DialogMarkdown from "./DialogMarkdown.vue";

interface TimelineEvent {
  dateRange: {
    start: Date;
    end: Date;
  };
  description?: string;
  markdownFile?: string;
}

const formatDateRange = (start: Date, end: Date): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const startMonth = monthNames[start.getMonth()];
  const endMonth = monthNames[end.getMonth()];

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}`;
  }
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
};

const currentDate = ref(new Date(/* "2024-11-21" */));

// Update current date every minute
setInterval(() => {
  currentDate.value = new Date();
}, 60000);

const findCurrentPosition = (events: TimelineEvent[]) => {
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const nextEvent = events[i + 1];

    // If we're in an event's date range
    if (
      currentDate.value >= event.dateRange.start &&
      currentDate.value <= event.dateRange.end
    ) {
      return { type: "during", event };
    }

    // If we're between this event and the next one
    if (
      nextEvent &&
      currentDate.value > event.dateRange.end &&
      currentDate.value < nextEvent.dateRange.start
    ) {
      return {
        type: "between",
        previousEvent: event,
        nextEvent,
      };
    }
  }
  return null;
};

const currentPosition = computed(() =>
  findCurrentPosition(timelineEvents.value),
);

const getTimelineStatus = (event: TimelineEvent) => {
  if (currentDate.value < event.dateRange.start) {
    return "upcoming";
  }
  if (
    currentDate.value >= event.dateRange.start &&
    currentDate.value <= event.dateRange.end
  ) {
    return "current";
  }
  return "past";
};

const timelineEvents = ref<TimelineEvent[]>([
  {
    dateRange: {
      start: new Date(2024, 9, 21), // October 21
      end: new Date(2024, 9, 24), // October 24
    },
    markdownFile: "update1.md",
  },
  {
    dateRange: {
      start: new Date(2024, 10, 12), // November 12
      end: new Date(2024, 10, 14, 23), // November 14
    },
    markdownFile: "update2.md",
  },
  {
    dateRange: {
      start: new Date(2024, 10, 19), // November 19
      end: new Date(2024, 10, 22, 23), // November 22
    },
    markdownFile: "update3.md",
  },
  {
    dateRange: {
      start: new Date(2024, 11, 10), // December 10
      end: new Date(2024, 11, 12, 23), // December 12
    },
  },
  {
    dateRange: {
      start: new Date(2025, 0, 14), // January 14
      end: new Date(2025, 0, 16, 23), // January 16
    },
  },
  {
    dateRange: {
      start: new Date(2025, 1, 4), // February 4
      end: new Date(2025, 1, 7, 23), // February 7
    },
  },
]);

const dialogTitle = ref("");
const markdownFile = ref("");
const dialogRef = useTemplateRef("dialogRef");

function openDialog({ title, filename }: { title: string; filename: string }) {
  if (!dialogRef.value) return;

  dialogTitle.value = title;
  markdownFile.value = filename;
  dialogRef.value.openDialog();
}

function dateToTitle(dateRange: { start: Date; end: Date }) {
  return formatDateRange(dateRange.start, dateRange.end);
}
</script>

<template>
  <div class="timeline">
    <div class="current-status" v-if="currentPosition">
      <template v-if="currentPosition.type === 'during'">
        <div class="status-badge current">
          <span class="pulse"></span>
          Currently Negotiating
        </div>
      </template>
      <template v-else-if="currentPosition.type === 'between'">
        <div class="status-badge between">
          <span class="between-indicator"></span>
          Between Sessions
        </div>
        <div class="between-details" v-if="currentPosition.nextEvent">
          <span
            >Next session starts
            {{
              formatDateRange(
                currentPosition.nextEvent.dateRange.start,
                currentPosition.nextEvent.dateRange.end,
              )
            }}</span
          >
        </div>
      </template>
    </div>

    <div
      v-for="(event, index) in timelineEvents"
      :key="index"
      class="timeline-event"
      :class="[
        getTimelineStatus(event),
        {
          'next-event':
            currentPosition?.type === 'between' &&
            currentPosition.nextEvent === event,
          past: getTimelineStatus(event) === 'past',
        },
      ]"
      :style="{ animationDelay: `${index * 0.2}s` }"
    >
      <div class="date">
        {{ formatDateRange(event.dateRange.start, event.dateRange.end) }}
      </div>
      <div
        v-if="getTimelineStatus(event) === 'current'"
        class="current-indicator"
      ></div>
      <button
        v-if="event.markdownFile"
        @click="
          openDialog({
            title: dateToTitle(event.dateRange),
            filename: event.markdownFile,
          })
        "
      >
        <h3>Notes</h3>
      </button>
    </div>
    <slot />
    <DialogMarkdown
      :title="dialogTitle"
      :markdown-file="markdownFile"
      ref="dialogRef"
    >
    </DialogMarkdown>
  </div>
</template>

<style scoped>
button {
  color: #213547;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-weight: normal;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.3);
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.current-status {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.timeline-event {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.timeline-event:hover {
  background: rgba(0, 102, 204, 0.05);
  transform: translateY(-2px);
}

.date {
  font-family: "Share Tech Mono", monospace;
  font-size: 1.2rem;
  color: #0066cc; /* Changed from #00f0ff for better contrast */
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date::before {
  content: "[";
}

.date::after {
  content: "]";
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
}

.status-badge.current {
  background: rgba(0, 102, 204, 0.1);
  color: #0066cc;
  text-shadow: none;
}

.status-badge.between {
  background: rgba(0, 0, 0, 0.1); /* Changed from rgba(255, 255, 255, 0.1) */
  color: #213547; /* Changed from #ffffff */
}

.between-indicator {
  width: 10px;
  height: 10px;
  background: #0066cc33; /* Changed from #ffffff */
  border-radius: 50%;
  animation: glow 2s infinite;
}

.between-details {
  margin-top: 0.5rem;
  color: #666666; /* Changed from rgba(255, 255, 255, 0.7) */
  font-size: 0.9rem;
}

.next-event {
  border-color: #0066cc; /* Changed from #ffffff */
  background: rgba(
    0,
    102,
    204,
    0.1
  ); /* Changed from rgba(255, 255, 255, 0.1) */
}

.status-indicator {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
}

.timeline-event.past .status-indicator {
  background: #888888;
}

.timeline-event.current .status-indicator {
  background: #ffc107;
}

.timeline-event.upcoming .status-indicator {
  background: #444444;
}

.timeline-event.past {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); /* Reduced shadow intensity */
  opacity: 0.7; /* Increased from 0.5 for better visibility */
  transform: translateX(-20px);
}

.timeline-event.current {
  border-color: #0066cc;
  background: rgba(0, 102, 204, 0.05);
  box-shadow: 0 0 30px rgba(0, 102, 204, 0.1);
}

.timeline-event:hover {
  transform: scale(1.02);
  background: rgba(
    0,
    102,
    204,
    0.05
  ); /* Changed from rgba(255, 255, 255, 0.1) */
}

.description {
  color: #444444; /* Changed from #cccccc */
  font-size: 1.1rem;
}

.current-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pulse {
  width: 10px;
  height: 10px;
  background: #0066cc; /* Changed from #00ffff for better contrast */
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px #0066cc; /* Changed from #00ffff for better contrast */
}

.current-indicator .text {
  color: #ffc107;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 242, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(0, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(0, 102, 204, 0.4); /* Changed from #ffffff */
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 102, 204, 0.6); /* Changed from #ffffff */
  }
}

@keyframes neonPulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.4);
  }
}
</style>
