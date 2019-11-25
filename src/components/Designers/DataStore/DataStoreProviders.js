// import AliOSS from './BlobStore/AliOSSStore'
import SqlDesigner from './SqlDesigner'

/** 数据存储的提供者 */
export default {
    providers: [
        [{ title: 'PostgreSQL', provider: 'appbox.Server.PostgreSQL;appbox.Server.PgSqlStore', designer: SqlDesigner }],
        // [{ title: 'Cassandra', provider: 'appbox.Server.Cassandra;appbox.Server.CassandraTableStore', designer: null }],
        // [{ title: '阿里云OSS', provider: 'appbox.Server.AliOSS;appbox.Server.AliOSSStore', designer: AliOSS }],
        // [{ title: 'Redis', provider: 'appbox.Server.Redis;appbox.Server.RedisCacheStore', designer: null }],
        // [{ title: 'ElasticSearch', provider: 'appbox.Server.ElasticSearch;appbox.Server.ElasticSearchStore', designer: null }]
    ],

    /** 根据存储类型及Provider获取相应的设计器 */
    getDesigner(node) {
        var ps = this.providers[node.Kind]
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i]
            if (p.provider === node.Provider) {
                return p.designer
            }
        }

        return null
    }
}