import {Link, useMatch, useResolvedPath} from "react-router-dom";

export function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <button className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </button>
    )
}