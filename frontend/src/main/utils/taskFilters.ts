import { Task } from '../types/task';

export function taskRows(tasks: Task[]): object[] {
  return tasks.map(task => [
    { text: task.title },
    { text: task.description ?? '—' },
    {
      html: `<strong class="govuk-tag govuk-tag--${statusColour(task.status)}">${task.status.replace('_', ' ')}</strong>`,
    },
    { text: new Date(task.dueDate).toLocaleDateString('en-GB') },
    {
      html: `<a href="/tasks/${task.id}/status" class="govuk-link">Update</a> &nbsp; <a href="/tasks/${task.id}/delete" class="govuk-link govuk-link--danger">Delete</a>`,
    },
  ]);
}

function statusColour(status: string): string {
  switch (status) {
    case 'TODO':
      return 'grey';
    case 'IN_PROGRESS':
      return 'blue';
    case 'DONE':
      return 'green';
    default:
      return 'grey';
  }
}
