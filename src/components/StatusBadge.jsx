
const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-amber-100 text-amber-800',
  expired: 'bg-gray-100 text-gray-800',
  unassigned: 'bg-blue-100 text-blue-800',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.unassigned}`}
    >
      {status}
    </span>
  );
}

