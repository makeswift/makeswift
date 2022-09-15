use swc_core::{
    ast::*,
    visit::{VisitMut, VisitMutWith,as_folder},
    common::Spanned,
    testing_transform::test
};
pub struct TransformVisitor;

impl VisitMut for TransformVisitor {
    fn visit_mut_bin_expr(&mut self, e: &mut BinExpr) {
        e.visit_mut_children_with(self);

        if e.op == op!("===") {
            e.left = Box::new(Ident::new("kdy1".into(), e.left.span()).into());
        }
    }
}

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    boo,
    r#"foo === bar;"#,
    r#"kdy1 === bar;"#
);