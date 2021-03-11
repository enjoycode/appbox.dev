import SqlDesigner from './SqlDesigner'
import CqlDesigner from './CqlDesigner'
import BlobDesigner from "./BlobDesigner";

/** 数据存储的提供者 */
export default {
    providers: [
        [{title: 'PostgreSQL', provider: 'appbox.Store.PostgreSQL;appbox.Store.PgSqlStore', designer: SqlDesigner}],
        [{title: 'Cassandra', provider: 'appbox.Store.Cassandra;appbox.Store.CassandraStore', designer: CqlDesigner}],
        [{title: 'SystemBlob', provider: null, designer: BlobDesigner}],
        // [{ title: 'Redis', provider: 'appbox.Server.Redis;appbox.Server.RedisCacheStore', designer: null }],
        // [{ title: 'ElasticSearch', provider: 'appbox.Server.ElasticSearch;appbox.Server.ElasticSearchStore', designer: null }]
    ],

    /** 根据存储类型及Provider获取相应的设计器 */
    getDesigner(node) {
        const ps = this.providers[node.Kind];
        for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            if (p.provider === node.Provider) {
                return p.designer
            }
        }

        return null
    }
}
