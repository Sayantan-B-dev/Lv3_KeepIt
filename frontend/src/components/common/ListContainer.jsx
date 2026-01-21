const ListContainer = ({ title, children }) => {
  return (
    <div className="all-container border-muted bg-type-b1">
      <h1 className="text-2xl font-extrabold text-center mb-10 text-type-1 tracking-tight ">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default ListContainer;
