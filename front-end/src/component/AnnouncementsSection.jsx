const AnnouncementsSection = ({ announcements }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Announcements</h3>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-b pb-4">
            <h4 className="font-medium">{announcement.title}</h4>
            <p>{announcement.content}</p>
            <p className="text-sm text-gray-600">
              Posted: {new Date(announcement.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsSection;
