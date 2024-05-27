"use client";

function Header() {
  return (
    <header className="w-full bg-white py-2 px-2">
      <nav className="w-full flex justify-end">
        <div className="flex">
          <div className="flex flex-col">
            <span>Hans Melchor</span>
            <span>Administrador</span>
          </div>
          <img
            className="w-16 rounded-md"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdxqfvSE4KQSYOo5KeBe8Y2AHHzIUZxcmMaDRvE49tHw&s"
            alt=""
          />
        </div>
      </nav>
    </header>
  );
}

export default Header;
