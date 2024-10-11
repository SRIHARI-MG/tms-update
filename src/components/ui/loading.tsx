const Loading = () => (
  <div className="flex h-screen justify-center items-center space-x-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-primary/20">
        <div className="w-full h-full rounded-full bg-primary animate-ping" />
      </div>
    ))}
  </div>
);
export default Loading;
