
const ListContainer = ({ title, children }) => {
  return (
    <div className="all-container border-muted bg-type-b1 relative overflow-hidden">

      <div className="relative z-10">
        <h1 className="text-2xl font-extrabold text-center mb-10 text-type-1 tracking-tight">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default ListContainer;
