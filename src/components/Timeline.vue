<script setup lang="ts">
import { ref, computed } from "vue";

interface TimelineEvent {
  dateRange: {
    start: Date;
    end: Date;
  };
  description: string;
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

const currentDate = ref(new Date());

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
    description: "Phase 1: Initial Development",
  },
  {
    dateRange: {
      start: new Date(2024, 10, 12), // November 12
      end: new Date(2024, 10, 14), // November 14
    },
    description: "Phase 2: Core Implementation",
  },
  {
    dateRange: {
      start: new Date(2024, 10, 19), // November 19
      end: new Date(2024, 10, 22), // November 22
    },
    description: "Phase 3: Feature Integration",
  },
  {
    dateRange: {
      start: new Date(2024, 11, 10), // December 10
      end: new Date(2024, 11, 12), // December 12
    },
    description: "Phase 4: Testing & Optimization",
  },
  {
    dateRange: {
      start: new Date(2025, 0, 14), // January 14
      end: new Date(2025, 0, 16), // January 16
    },
    description: "Phase 5: Final Review",
  },
  {
    dateRange: {
      start: new Date(2025, 1, 4), // February 4
      end: new Date(2025, 1, 7), // February 7
    },
    description: "Phase 6: Launch & Deployment",
  },
]);
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
      <div class="status-indicator"></div>
      <div class="date">
        {{ formatDateRange(event.dateRange.start, event.dateRange.end) }}
      </div>
      <div
        v-if="getTimelineStatus(event) === 'current'"
        class="current-indicator"
      >
        <span class="pulse"></span>
        <span class="text">Current</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.current-status {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.status-badge.between {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.between-indicator {
  width: 10px;
  height: 10px;
  background: #ffc107;
  border-radius: 50%;
  animation: glow 1.5s ease-in-out infinite alternate;
}

.between-details {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.timeline-event {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  @starting-style {
    transform: translateX(-50px);
  }
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 1s ease;
  position: relative;
  padding-left: 3rem;
}

.next-event {
  border-color: #ffc107;
  background: rgba(255, 193, 7, 0.1);
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
  background: #ffffff;
}

.timeline-event.upcoming .status-indicator {
  background: #444444;
}

.timeline-event.past {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 1);
  opacity: 0.5;
  transform: translateX(-20px);
}

.timeline-event.current {
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.timeline-event:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.1);
}

.date {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.description {
  color: #cccccc;
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
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.current-indicator .text {
  color: #ffffff;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px #ffc107, 0 0 10px #ffc107, 0 0 15px #ffc107;
  }
  to {
    box-shadow: 0 0 10px #ffc107, 0 0 20px #ffc107, 0 0 30px #ffc107;
  }
}
</style>
