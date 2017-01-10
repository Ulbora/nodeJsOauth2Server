SELECT * 
FROM client_role cr inner join 
uri_role ur on cr.id = ur.client_role_id
left join client_allowed_uri cau on cau.id = ur.client_allowed_uri_id
WHERE cr.client_id = 403
order by ur.client_role_id

SELECT cr.id as role_id, cr.role,  cau.id as uri_id, cau.uri, cr.client_id
FROM client_role cr inner join 
uri_role ur on cr.id = ur.client_role_id
left join client_allowed_uri cau on cau.id = ur.client_allowed_uri_id
WHERE cr.client_id = 403
order by ur.client_role_id