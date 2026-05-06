# HIS微前端-人员管理

## 基础组件

- 乾坤
- 若依plus微前端
- 项目来源：[https://github.com/rolkey/RuoYi-Cloud-Plus-2.x-UI-HIS-Base](https://github.com/rolkey/RuoYi-Cloud-Plus-2.x-UI-HIS-Base)

## 编译参数

```bash
pnpm store prune
rm -rf node_modules
rm -rf pnpm-lock.yaml
pnpm i
# 编译
rm -rf dist && rm -f dist.tar.gz && pnpm build && tar -czf dist.tar.gz dist
```

## 升级服务器

```bash
# 部署drg测试虚拟机， 合并部署脚本：传输文件并在服务器端执行解压和替换操作
scp ./dist.tar.gz db12_drg:/var/www/ && ssh db12_drg "cd /var/www && tar -xzf dist.tar.gz && rm -rf poct-8105-lis && mv dist poct-8105-lis && echo 'his部署完成。'"
```

## 显示字段长度调整

```
  Session   字段长度对齐：inspectionGroup 表格字段显示长度调整
  Continue  opencode -s ses_257354008ffe4h8C3Vsv8SfZPU
```

## 参考图片调整字段长度

```
  Session   Charge item table field length adjustment
  Continue  opencode -s ses_24d694db1ffewZw37P4OwDJ3lu
```
